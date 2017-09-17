import $ from 'jquery';
import axios from 'axios';
import util from 'util';

class InputComment {
  constructor(block) {
    this.$commentBlock = $(block);
    this.state = {};
    
    this.getData();    
    this.attachListeners();
  }
  
  attachListeners() {
    this.$commentBlock.on('keydown', (event) => {
      const {target} = event;
      window.elem = target;
      target.textLength > 2 
        ? this.handleInput(target) 
        : null; 
    });
  }
  
  getData() {
    axios.get('data.json')
    .then(result => {
      this.setState({
        data: result.data
      });
    })
    .catch(err => console.log(`error in getData \n ${err}`));
  }
  
  handleInput(input) {
    console.log(input.value);
  }
  
  setState(addToState) {
    this.state = Object.assign({}, this.state, addToState);
  }
}

document.addEventListener('DOMContentLoaded', ()=> {
  const block = new InputComment('.comment-block');
});