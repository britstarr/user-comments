import $ from 'jquery';
import axios from 'axios';
import util from 'util';

class CommentBlock {
  constructor(block) {
    this.$commentBlock = $(block);
    this.state = {};
    
    this.getData();    
    this.attachListeners();
  }
  
  attachListeners() {
    this.$commentBlock.keypress(event => {
      const {target} = event;
      window.elem = target;
      target.textLength > 2 
        ? this.handleInput(target.value, target.textLength) 
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
  
  handleInput(input, chars) {
    this.setState({
      findUsers: true
    });
    const {data} = this.state;
    input = input.toLowerCase();
    // reset the matches array if user continues to type
    this.setState({
      matches: []
    });
    
    $(data).each((i, currentUser) => {
      const { username, name } = currentUser;
      let userSub, 
          nameSub;
      //check that the first x letters of the name or username match. If user types in "Aar", I want a result for "Aaron...", not "maaargie74"
      userSub = username.substring(0, chars).toLowerCase();
      nameSub = name.substring(0, chars).toLowerCase();
      
      if (userSub.includes(input) || nameSub.includes(input)) {
        this.setState({
          matches: [...this.state.matches, currentUser]
        });
        $(document).trigger('newMatches', [this.state.matches]);
      }
    });
  }
  
  setState(addToState) {
    this.state = Object.assign({}, this.state, addToState);
  }
}

document.addEventListener('DOMContentLoaded', ()=> {
  const block = new CommentBlock('.comment-block');
});