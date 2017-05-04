(function() {
    'use strict';

    angular
        .module('pmc')
        .controller('registerNew', registerNew);

    registerNew.$inject = ['$log', '$scope', '$rootScope', '$location', '$filter', '$timeout', '$interval', '$q', '$sce', 'accountService', 'calendarService', 'dataService', 'teamManagementService', 'salesForceService'];

    function registerNew($log, $scope, $rootScope, $location, $filter, $timeout, $interval, $q, $sce, accountService, calendarService, dataService, teamService, salesForceService) {
        $log.info('New Registration Flow Controller Loaded');
        var self = this;
        init();

        function init() {
            // Wizard
            self.user = {
                agree: false,
                step: 0
            };

            // Loading Spinners Configuration
            self.isLoading = false;
            self.isSaving = false;
            self.isDiscovering = false;

            // Popups
            self.isShowPopupVideo = false;
            self.popupMsft = {
                isShow: false,
                isShowThanks: false,
                timeout: null,
                wasSentToSalesForce: false
            };
            self.popupGoog = {
                isShow: false,
                isShowThanks: false,
                timeout: null,
                wasSentToSalesForce: false
            };

            // Video Links and Functionality
            self.youTubeUrls = {
                overview: 'https://www.youtube.com/embed/MAsdjDVpbN8?autoplay=1',
                iamuser: 'https://www.youtube.com/embed/hWDOtDQdRn8?autoplay=1',
                iamrole: 'https://www.youtube.com/embed/ppwkWBsUBEU?autoplay=1'
            };
            self.videoToPlay = '';

            // Extended Validation
            self.watcher = function () {};
            self.credential_copy = {};
            self.sameValues = false;

            // Credential Information
            self.credential = {
                type: 'role'
            };
            self.IAMRole = {
                id: null,
                accountNumber: '',
                externalId: '',
                arn: '',
                isSaved: false
            };
            self.IAMUser = {
                id: null,
                accessKeyId: '',
                secretAccessKey: '',
                isSaved: false
            };

            // SetUp Notification dialog
            self.notificationDialog = null;
            setNotificationDialog();

            // Move to step 2 if account is already created
            var keysExist = $.cookie('hasKeys');
            self.user.step = !!keysExist ? 2 : 0;
        }

        function getDataForAccountCreation() {
            return {
                first_name: self.user.firstName,
                last_name: self.user.lastName,
                email_address: self.user.email,
                organization_name: self.user.company,
                job_title: self.user.job,
                phone_number: self.user.phone,
                password: self.user.password,
                is_dst: self.user.is_dst,
                time_zone: self.user.time_zone
            };
        }

        function getDataForStepZero() {
            return {
                first_name: self.user.firstName,
                last_name: self.user.lastName,
                email_address: self.user.email
            };
        }

        self.errorHandler = function(error) {
            var dialogMessage = [];
            var errorConstant = error.data.data;
            if (errorConstant && errorConstant.length) {
                if (typeof errorConstant === 'string') {
                    dialogMessage.push($filter('translate')(errorConstant) || errorConstant);
                } else {
                    for (var i = 0, iLen = errorConstant.length; i < iLen; i++) {
                        dialogMessage.push($filter('translate')(errorConstant[i]) || errorConstant);
                    }
                }
            } else if (error.data.code) {
                dialogMessage.push($filter('translate')(error.data.code) || error.data.message || 'UNKNOWN ERROR');
            } else  {
                dialogMessage.push('UNKNOWN ERROR');
            }

            var params = getDefaultParams();
            params.isVisible = true;
            params.cancelButton.isVisible = false;
            params.isInProgress = false;
            params.dialogTitle = dialogMessage;
            self.notificationDialog = params;
        };

        self.passwordChange = function() {
            var pwdsAreEqual = angular.equals(self.user.password, self.user.passwordConfirm);
            $scope.stepOneForm.passwordConfirm.$setValidity('pwmatch', pwdsAreEqual);
        };

        // Wizard steps handlers

        self.moveToStep1 = function() {
            var stepZeroDataExists = self.user.email && self.user.firstName && self.user.lastName;
            if (!stepZeroDataExists) return;

            self.isLoading = true;
            var data = getDataForStepZero();
            accountService.stepZero(data).then(function(response) {
                salesForceService.stepZero(data);
                setTimeParams(self.user);
            }).catch(function(error) {
                self.errorHandler(error);
                self.isLoading = false;
            });
        };

        self.moveToStep2 = function() {
            var stepZeroDataExists = self.user.email && self.user.firstName && self.user.lastName;
            var stepOneDataExists = self.user.company && self.user.phone && self.user.password;
            if (!(stepZeroDataExists && stepOneDataExists)) return;

            self.isLoading = true;
            var data = getDataForAccountCreation();
            accountService.createAccount(data).then(function(response) {
                login(data.email_address, data.password).then(function(resources) {
                    dataService.startStatusUpdater($rootScope.UPDATE_STATUS_LONG_INTERVAL);
                    salesForceService.stepOne(resources.data.token);

                    $.cookie('firstLogin', 3); // because there are too many places with firstLogin = 3 as part of old registration flow
                    $.cookie('token', resources.data.token);
                    $.cookie('user_id', resources.data.user_id);
                    $.cookie('accountName', resources.data.first_name + ' ' + resources.data.last_name);
                    $.cookie('firstName', resources.data.first_name);
                    $.cookie('goodStanding', resources.data.good_standing);
                    $.cookie('hasKeys', resources.data.has_keys);
                    $.cookie('autoRefreshDashboard', resources.data.auto_refresh_dashboard);
                    $.cookie('company', JSON.stringify(resources.data.company)); // JSON.stringify({ id: 1, name: 'viacode' })
                    $.cookie('role', JSON.stringify(resources.data.role));
                    $rootScope.userName = resources.data.first_name + ' ' + resources.data.last_name;

                    // create default team
                    var team = { organization_id : resources.data.company.id, name: 'my first team', users: [] };
                    teamService.addTeam(resources.data.token, team).then(function (response) {
                        self.user.teamId = response.data.data.id;
                        self.user.step = 2;
                    }).catch(function(error) {
                        self.isLoading = false;
                        self.errorHandler(error);
                    });
                }).catch(function(error) {
                    self.isLoading = false;
                    self.errorHandler(error);
                });

                self.isLoading = false;
            }).catch(function(error) {
                self.isLoading = false;
                self.errorHandler(error);
            });
        };

        self.moveToStep3 = function() {
            var token = $.cookie('token');
            if (self.credential.type === 'role') {
                getIAMRoleInformation(token).then(function(data) {
                    self.IAMRole.id = data.id;
                    self.IAMRole.isSaved = !!data.id;
                    self.IAMRole.accountNumber = data.accountNumber;
                    self.IAMRole.externalId = data.externalId;
                    self.IAMRole.arn = data.arn;
                    self.user.step = 3;
                    setRoleValidation();
                });
            } else {
                getIAMUserInformation(token).then(function (data) {
                    self.IAMUser.id = data.id;
                    self.IAMUser.isSaved = !!data.id;
                    self.IAMUser.accessKeyId = data.accessKey;
                    self.IAMUser.secretAccessKey = data.secretKey;
                    self.user.step = 3;
                });
            }
        };

        // Extended validation

        function setRoleValidation() {
            updateRoleValidation();
            $scope.IAMRole = self.IAMRole;
            self.watcher = $scope.$watch('IAMRole', function (newValue, oldValue) {
                self.sameValues = !!angular.equals(self.credential_copy, newValue);
            }, true);
        }

        function updateRoleValidation() {
            self.IAMRole.isSaved = !!self.IAMRole.id;
            self.credential_copy = angular.copy(self.IAMRole);
            self.sameValues = !!angular.equals(self.credential_copy, self.IAMRole);
        }

        function updateRoleCredential(newId) {
            self.IAMRole.id = newId;
        }

        // Private methods

        function setTimeParams(userParams) {
            self.isLoading = true;

            calendarService.getTimezones().then(function(response) {
                var timeZones = response.data;

                var offset = $filter('date')(new Date(), 'Z');
                var formattedOffset = offset.slice(0, 3) + ':' + offset.slice(3);
                var offsetHour = parseInt(formattedOffset);
                var params = {};

                var date = new Date().dst();
                if (date) {
                    offsetHour -= 1;
                    params.is_dst = true;
                } else {
                    params.is_dst = false;
                }

                formattedOffset = '';
                if (Math.abs(offsetHour) < 9) {
                    if (offsetHour < 0) {
                        formattedOffset += '-';
                    } else {
                        formattedOffset += '+';
                    }
                    formattedOffset += '0' + Math.abs(offsetHour) + ':00';
                } else {
                    formattedOffset += ':00';
                }

                var currentTimeZone = getTimeZoneByOffset(formattedOffset, timeZones);
                params.time_zone = currentTimeZone.title;

                // store info into self.user
                userParams.is_dst = params.is_dst;
                userParams.time_zone = params.time_zone;

                // move to account information
                self.user.step = 1;
                self.isLoading = false;
            }).catch(function(error) {
                self.errorHandler(error);
                self.isLoading = false;
            });
        }

        function getTimeZoneByOffset(offset, timeZones) {
            var matchedZone = {};
            for (var i = 0, zone; zone = timeZones[i]; i += 1) {
                if (zone.utc_offset == offset) {
                    matchedZone = zone;
                    break;
                }
            }

            if (!matchedZone.title) {
                matchedZone = timeZones[0];
            }

            return matchedZone;
        }

        function getIAMRoleInformation(token) {
            var deferred = $q.defer(),
                accountNumber = '',
                externalId = '';

            teamService.getCredentials(token).then(function (credentials_) {
                var credentials = credentials_.data.data;
                if (credentials) {
                    var filtered = $filter('filter')(credentials, { iam_cred_type: 'IAM Role' }, true);
                    if (filtered.length == 0) {
                        accountService.getAccountNumber(token).then(function(accountNumber_) {
                            accountNumber = accountNumber_.data.data;
                            if (accountNumber && externalId) {
                                deferred.resolve({ accountNumber: accountNumber, externalId: externalId, arn: '', id: null });
                            }
                        }).catch(self.errorHandler);
                        accountService.createIAMRoleInformation(token).then(function(externalId_) {
                            externalId = externalId_.data.data;
                            if (accountNumber && externalId) {
                                deferred.resolve({ accountNumber: accountNumber, externalId: externalId, arn: '', id: null });
                            }
                        }).catch(self.errorHandler);
                    } else {
                        accountService.getAccountNumber(token).then(function(accountNumber_) {
                            var cred = filtered[0];
                            deferred.resolve({
                                id: cred.id,
                                accountNumber: accountNumber_.data.data,
                                externalId: cred.iam_role_external_id,
                                arn: cred.iam_role_arn || ''
                            });
                        }).catch(self.errorHandler);
                    }
                }
            }).catch(self.errorHandler);

            return deferred.promise;
        }

        function getIAMUserInformation(token) {
            var deferred = $q.defer();

            teamService.getCredentials(token).then(function (credentials_) {
                var credentials = credentials_.data.data;
                if (credentials) {
                    var filtered = $filter('filter')(credentials, { iam_cred_type: 'IAM User' }, true);
                    if (filtered.length == 0) {
                        deferred.resolve({ accessKey: '', secretKey: '', id: null });
                    } else {
                        var cred = filtered[0];
                        deferred.resolve({ accessKey: cred.access_key_id, secretKey: cred.secret_access_key, id: cred.id });
                    }
                }
            }).catch(self.errorHandler);

            return deferred.promise;
        }

        function getCredentialData(token, credentialType) {
            var deferred = $q.defer(),
                result = {};

            if (credentialType == 'user') {
                result.name = 'First User credential';
                result.iam_cred_type = "IAM User";
                result.access_key_id = self.IAMUser.accessKeyId;
                result.secret_access_key = self.IAMUser.secretAccessKey;
                result.id = self.IAMUser.id;
            } else {
                result.name = 'First Role credential';
                result.iam_cred_type = "IAM Role";
                result.iam_role_external_id = self.IAMRole.externalId;
                result.iam_role_arn = !self.IAMRole.arn || self.IAMRole.arn == '' ? null : self.IAMRole.arn;
                result.id = self.IAMRole.id;
            }

            teamService.getTeams(token).then(function(teams_) {
                var teams = teams_.data.data;
                if (teams && teams.length > 0) {
                    result.default_ingest_team_id = teams[0].id;
                }
                deferred.resolve(result);
            }).catch(self.errorHandler);

            return deferred.promise;
        }

        function login(username, password) {
            return accountService.login({ username: username, password: password });
        }

        function addOrUpdateCredential(token, credential) {
            if (credential.id) {
                return teamService.editCredentials(token, credential.id, credential);
            } else {
                return teamService.addCredentials(token, credential);
            }
        }

        function getCredentialDataAfterManipulation(serverData, clientData) {
            if (serverData && serverData.data && serverData.data.data && serverData.data.data.id) {
                return { id: serverData.data.data.id, isUpdate: false };
            } else {
                return { id: clientData.id, isUpdate: true };
            }
        }

        function discover() {
            var token = $.cookie('token');
            if (!isValidCredential(self.credential.type) || !token) return;

            self.isDiscovering = true;
            getCredentialData(token, self.credential.type).then(function (data_) {
                teamService.discoverCredential(token, data_.id).then(function (status_) {
                    self.isDiscovering = false;

                    var dialogParams = getDefaultParams();
                    dialogParams.isVisible = true;
                    dialogParams.isInProgress = true;
                    dialogParams.progressBar = { isShow: true, items: null };
                    self.notificationDialog = dialogParams;

                    salesForceService.stepTwo(token, { iam_cred_type: data_.iam_cred_type }).then(function (response_) {
                        salesForceService.stepThree(token);
                    });

                    var firstLogin = $.cookie('firstLogin');
                    if (firstLogin && firstLogin == 3) {
                        $.cookie('firstLogin', 4);
                    }

                    self.keysInterval = $interval(function() {
                        teamService.discoverStatus(token, data_.id).then(function (response_) {
                            if (!response_.data) return;

                            if (response_.data.state === 'running' || response_.data.state === 'completed') {
                                dialogParams.progressBar.items = {
                                    processed:  response_.data.processed_items,
                                    total:      response_.data.total_items
                                };

                                if (response_.data.state === 'completed') {
                                    $.cookie('hasKeys', 'true');
                                    $interval.cancel(self.keysInterval);
                                    $timeout(function() {
                                        dialogParams.progressBar.isShow = false;
                                        $location.path('/dashboard/');
                                    }, 2000);
                                }
                            } else {
                                dialogParams.progressBar.isShow = false;
                                $interval.cancel(self.keysInterval);
                                $log.info(response_.data.state);
                            }
                        })
                    }, 10000);
                }).catch(discover_catchMethod);
            }).catch(discover_catchMethod);
        }

        function discover_catchMethod(error) {
            self.isDiscovering = false;
            self.errorHandler(error);
        }

        function save() {
            var token = $.cookie('token');
            if (!isValidCredential(self.credential.type) || !token) return;

            self.isSaving = true;
            getCredentialData(token, self.credential.type).then(function (data_) {
                addOrUpdateCredential(token, data_).then(function (credential_) {
                    var credential = getCredentialDataAfterManipulation(credential_, data_);

                    self.isSaving = false;

                    updateRoleCredential(credential.id);
                    updateRoleValidation();
                    showSimpleDialog(credential.isUpdate ? 'KEYS_SUCCESSFULLY_UPDATED_ONLY' : 'KEYS_SUCCESSFULLY_SAVED_ONLY' );

                }).catch(save_catchMethod);
            }).catch(save_catchMethod);
        }

        function save_catchMethod(error) {
            self.isSaving = false;
            self.errorHandler(error);
        }

        function saveAndDiscover() {
            var token = $.cookie('token');
            if (!isValidCredential(self.credential.type) || !token) return;

            self.isLoading = true;
            getCredentialData(token, self.credential.type).then(function (data_) {
                addOrUpdateCredential(token, data_).then(function (credential_) {
                    var cred = getCredentialDataAfterManipulation(credential_, data_);
                    teamService.discoverCredential(token, cred.id).then(function (discover_) {
                        self.isLoading = false;

                        var dialogParams = getDefaultParams();
                        dialogParams.isVisible = true;
                        dialogParams.isInProgress = true;
                        dialogParams.progressBar = { isShow: true, items: null };
                        self.notificationDialog = dialogParams;

                        salesForceService.stepTwo(token, { iam_cred_type: data_.iam_cred_type }).then(function (res_) {
                            salesForceService.stepThree(token);
                        });

                        var firstLogin = $.cookie('firstLogin');
                        if (firstLogin && firstLogin == 3) {
                            $.cookie('firstLogin', 4);
                        }

                        self.keysInterval = $interval(function() {
                            teamService.discoverStatus(token, cred.id).then(function (response_) {
                                if (!response_.data) return;

                                if (response_.data.state === 'running' || response_.data.state === 'completed') {
                                    dialogParams.progressBar.items = {
                                        processed:  response_.data.processed_items,
                                        total:      response_.data.total_items
                                    };

                                    if (response_.data.state === 'completed') {
                                        $.cookie('hasKeys', 'true');
                                        $interval.cancel(self.keysInterval);
                                        $timeout(function() {
                                            dialogParams.progressBar.isShow = false;
                                            $location.path('/dashboard/');
                                        }, 2000);
                                    }
                                } else {
                                    dialogParams.progressBar.isShow = false;
                                    $interval.cancel(self.keysInterval);
                                    $log.info(response_.data.state);
                                }
                            })
                        }, 10000);
                    }).catch(saveAndDiscover_catchMethod);
                }).catch(saveAndDiscover_catchMethod);
            }).catch(saveAndDiscover_catchMethod);
        }

        function saveAndDiscover_catchMethod(error) {
            self.isLoading = false;
            self.errorHandler(error);
        }

        function isValidCredential(type) {
            if (type == 'user') {
                return self.IAMUser.accessKeyId && self.IAMUser.secretAccessKey;
            } else {
                return self.IAMRole.accountNumber && self.IAMRole.externalId;
            }
        }

        // Dialog and Progress Bar

        function setNotificationDialog(params) {
            self.notificationDialog = params || getDefaultParams();
        }

        function getDefaultParams() {
            return {
                dialogTitle: [],
                content: '',
                confirmButton: getButton($filter('translate')('OK')),
                cancelButton: getButton($filter('translate')('CANCEL')),
                isVisible: false,
                isInProgress: false
            };
        }

        function getButton(text, isVisible, callbackFunc, args) {
            return {
                text: text || '',
                isVisible: isVisible || true,
                callbackFunc: callbackFunc || null,
                args: args || null
            };
        }

        function showSimpleDialog(key) {
            var dialogParams = getDefaultParams();
            dialogParams.isVisible = true;
            dialogParams.cancelButton.isVisible = false;
            dialogParams.content = $filter('translate')(key);
            self.notificationDialog = dialogParams;
        }

        // Popups

        self.togglePopupVideo = function() {
            var videoPath = self.youTubeUrls.overview;
            if ( self.user.step === 3 ) {
                if (self.credential.type === 'user')
                    videoPath = self.youTubeUrls.iamuser;
                if (self.credential.type === 'role')
                    videoPath = self.youTubeUrls.iamrole
            }
            self.videoToPlay = $sce.trustAsResourceUrl(videoPath);
            self.isShowPopupVideo = !self.isShowPopupVideo;
        };

        self.hidePopupMsftAndGoog = function() {
            self.popupMsft.isShow = false;
            self.popupMsft.isShowThanks = false;
            $timeout.cancel(self.popupMsft.timeout);

            self.popupGoog.isShow = false;
            self.popupGoog.isShowThanks = false;
            $timeout.cancel(self.popupGoog.timeout);
        };

        self.togglePopupMsft = function() {
            self.popupMsft.isShow = !self.popupMsft.isShow;

            if (self.popupMsft.wasSentToSalesForce) {
                self.popupMsft.isShowThanks = true;
                self.popupMsft.timeout = $timeout(function() {
                    self.popupMsft.isShow = false;
                    self.popupMsft.isShowThanks = false;
                }, 5000);
            }
        };

        self.showMsftThanks = function() { //Notify me on product support
            if (!self.popupMsft.wasSentToSalesForce) {
                var data = ['microsoft_azure'];
                accountService.stepTwo(data).then(function(response) {
                    self.popupMsft.isShowThanks = true;
                    self.popupMsft.timeout = $timeout(function() {
                        self.popupMsft.isShow = false;
                        self.popupMsft.isShowThanks = false;
                    }, 5000);

                    self.popupMsft.wasSentToSalesForce = true;
                }).catch(function(error) {
                    self.errorHandler(error);
                    self.popupMsft.wasSentToSalesForce = false;
                });

                return;
            }

            self.popupMsft.isShowThanks = true;
            self.popupMsft.timeout = $timeout(function() {
                self.popupMsft.isShow = false;
                self.popupMsft.isShowThanks = false;
            }, 5000);
        };

        self.togglePopupGoog = function() {
            self.popupGoog.isShow = !self.popupGoog.isShow;

            if (self.popupGoog.wasSentToSalesForce) {
                self.popupGoog.isShowThanks = true;
                self.popupGoog.timeout = $timeout(function() {
                    self.popupGoog.isShow = false;
                    self.popupGoog.isShowThanks = false;
                }, 5000);
            }
        };

        self.showGoogThanks = function() {
            if (!self.popupGoog.wasSentToSalesForce) {
                var data = ['google_cloud_platform'];
                accountService.stepTwo(data).then(function(response) {
                    self.popupGoog.isShowThanks = true;
                    self.popupGoog.timeout = $timeout(function() {
                        self.popupGoog.isShow = false;
                        self.popupGoog.isShowThanks = false;
                    }, 5000);

                    self.popupGoog.wasSentToSalesForce = true;
                }).catch(function(error) {
                    self.errorHandler(error);
                    self.popupGoog.wasSentToSalesForce = false;
                });

                return;
            }

            self.popupGoog.isShowThanks = true;
            self.popupGoog.timeout = $timeout(function() {
                self.popupGoog.isShow = false;
                self.popupGoog.isShowThanks = false;
            }, 5000);
        };

        // Buttons handlers

        self.onDiscover = function() {
            if (self.credential.type == 'user') {
                saveAndDiscover();
            } else {
                discover();
            }
        };

        self.onSave = function () {
            save();
        };

        self.onIamPolicy = function() {
            var token = $.cookie('token');
            if (!token) return;

            self.isPolicyLoading = true;
            accountService.getIAMPolicy(token).then(function (policy_) {
                self.isPolicyLoading = false;
                var params = getDefaultParams();
                var subtitle = 'Policy Name: ParkMyCloud\nPolicy Description: All in one policy (IAM and EC2) for ParkMyCloud\n\n';
                var code = JSON.stringify(policy_.data, null, '  ');
                params.isVisible = true;
                params.title = ['IAM Policy'];
                params.content = subtitle + code;
                params.isCodeInContent = true;
                params.cancelButton.isVisible = false;
                self.notificationDialog = params;
            }).catch(function (error) {
                self.isPolicyLoading = false;
                self.errorHandler(error);
            });
        };
    }
})();
