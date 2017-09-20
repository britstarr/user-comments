import $ from 'jquery';
import axios from 'axios';
import util from 'util';

class CommentBlock {
  constructor(block) {
    this.$commentBlock = $(block);
    this.state = {
      search: false,
      searchString: '',
      count: 0
    };
    
    this.getData();    
    this.attachListeners();
  }
  
  attachListeners() {
    this.$commentBlock.keypress(event => {
      const {target} = event;
      event.keyCode === 64
        ? this.setSearchStatus(target.value, target.textLength) 
        : this.trackTag(event.keyCode) ; 
    });
    
    $(document).on('resetSearch', () => {
      this.setState({
        search: false
      });
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
  
  trackTag(charCode) {  
    const char = String.fromCharCode(charCode);
    let {searchString} =  this.state;
    let updatedSearchString,
        charLength;
    
    //check if we're searching, if so, keep track of what's being typed
    if (this.state.search) {
      updatedSearchString = searchString += char; 
      charLength = updatedSearchString.length;
      
      this.setState({
        searchString: updatedSearchString,
        count: this.state.count += 1
      });

      this.handleInput(updatedSearchString, charLength);
    }
  }
  
  setSearchStatus(input, chars) {
    //to start a new search, set search state to true and clear the search string and character count
    this.setState({
      search: true,
      searchString: '',
      count: 0
    });
  }
  
  handleInput(input, chars, three) {
    let {data} = this.state;
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

//on load, create an instance of the CommentBlock class
document.addEventListener('DOMContentLoaded', ()=> {
  const block = new CommentBlock('.comment-block');
});