import $ from 'jquery';
import 'jquery-ui';
import axios from 'axios';
import util from 'util';

class ResultItem {
  constructor(block) {
    this.$result = $(block);
    this.state = {};
    console.log('in the result', block)
  }
  
  
  setState(addToState) {
    this.state = Object.assign({}, this.state, addToState);
  }
}

export class ResultItems {
  constructor(selector) {
    this.items = $(selector).map((idx, val) => {
      let item = $(val);
      return new ResultItem(item.attr('data-result-id'));
    });
  }
}

document.addEventListener('DOMContentLoaded', ()=> {
  const result = new ResultItems('.result-item');
});