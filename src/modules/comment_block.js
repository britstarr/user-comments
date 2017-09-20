import $ from 'jquery';
import axios from 'axios';
import util from 'util';

class CommentBlock {
  constructor(block) {
    this.$commentBlock = $(block);
    this.state = {
      search: false, //whether or not search functions should run
      searchString: '', //the input being searched against user data
      count: 0 //number of characters being used as search
    };
    
    this.getData();    
    this.attachListeners();
  }
  
  attachListeners() {
    //if the @ key was pressed...
    this.$commentBlock.keypress(event => {
      const {target} = event;
      event.keyCode === 64
        ? this.setSearchStatus(target.value, target.textLength) 
        : this.trackTag(event.keyCode) ; 
    });
    
    //if a delete key was pressed, adjust state accordingly
    this.$commentBlock.keydown(event => {
      if (event.keyCode === 8 || event.keyCode === 46 ) {
        this.handleDeletions();
      }
    });
    
    //listen for events to reset the search
    $(document).on('searchCompleted', () => {
      this.setState({
        search: false
      });
    });
  }
  
  emptyWidget() {
    const {matches} = this.state;
    const {searchString} = this.state;
    //if there are no matches and no search string, hide the widget
    if (matches.length === 0 && searchString.length === 0) {
      $(document).trigger('noMatches');
    }
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
  
  handleDeletions() {
    let {searchString} = this.state;
    let {count} = this.state;
    
    //as long as there are still characters left for search...
    if (searchString.length > 1) {
      searchString = searchString.slice(0, -1);
      count = count -= 1;
      this.setState({
        count,
        searchString
      });
      this.handleSearchText(searchString, count);
    } else {
      //reset search related state items
      this.setState({
        matches: [],
        count: 0,
        searchString: ''
      });
      this.emptyWidget();
    }
  }
  
  handleSearchText(input, chars) {
    let {data} = this.state;
    let match = false; //i
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
        match = true;
        this.setState({
          matches: [...this.state.matches, currentUser]
        });
        $(document).trigger('newMatches', [this.state.matches]);
      }
    });    
    
    match === false ? $(document).trigger('newMatches', []) : null;
  }
  
  setSearchStatus(input, chars) {
    //to start a new search, set search state to true and clear the search string and character count
    this.setState({
      search: true,
      searchString: '',
      count: 0
    });
    //reset the char count data attr for new search
    $(this.$commentBlock).attr('data-char-len', 0);
  }
  
  setState(addToState) {
    this.state = Object.assign({}, this.state, addToState);
  }
  
  trackTag(charCode) {  
    //tranform charCode and get reference to search state items
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
      //set the char count as a data attr for widget class to use when inserting a username
      $(this.$commentBlock).attr('data-char-len', this.state.count);
      this.handleSearchText(updatedSearchString, charLength);
    }
  }
}

//on load, create an instance of the CommentBlock class
document.addEventListener('DOMContentLoaded', ()=> {
  const block = new CommentBlock('.comment-block');
});