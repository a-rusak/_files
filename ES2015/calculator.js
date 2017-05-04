class CalculatorExams {

  constructor() {
    this.name = {
      form: 'calculatorExams',
      total: '.c-info-number__value'
    }
    this.MAX_NUMBERS_OF_EXAMS = 3;
    this.inputs = [];
    this.button = null;
    this.form = null;
    this.exams = new Set();
    this.totalCountLabel = null;
  }

  init() {
    this.form = document.forms[this.name.form];
    if (!!this.form) {
      const _arr = [...this.form.elements];
      this.button = _arr.splice(-1);
      this.inputs = _arr.slice(0, _arr.length - 1);
      this.totalCountLabel = this.form.querySelector(this.name.total);
      this.totalCountLabel.innerText = '0'; //'&#8734;'

      this.form.addEventListener('input', this._onValueChange.bind(this));
    }

  }

  _onValueChange() {
    let total = 0;

    
    this.inputs.forEach((item) => {
      this._updateDisabledInputs();

      if (item.value !== '') {
        this.exams.add(item.name);
        total += parseInt(item.value);
      } else {
        this.exams.delete(item.name);
      }
    });
    this.totalCountLabel.innerText = total;
    //this.exams.forEach((value, valueAgain, set) => {
      //console.log(value, set.size);
    //});
  }

  _updateDisabledInputs() {
    this.inputs.forEach((input) => {
      if (this.exams.size >= this.MAX_NUMBERS_OF_EXAMS && !this.exams.has(input.name)) {
        input.setAttribute('disabled', 'true');
        input.value = '';
      } else {
        input.removeAttribute('disabled');
      }
    })
  }

}

export {
  CalculatorExams
}