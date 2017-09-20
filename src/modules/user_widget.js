import $ from 'jquery';

class UserWidget {
  constructor(selector) {
    this.$widgetItem= selector;
    this.state = {};
    this.attachInitialListeners();
  }
  
  attachInitialListeners() {
    //listeners required to create results
    $(document).on('newMatches', (e, newMatches) => {
      this.createItem(newMatches);
    });
  }
  
  attachItemListeners(selector) {
    //once results exist, add listeners to them
    $(selector).click(e => this.addToComment(e));
  }
  
  addToComment(event) {
    let item = $(event.target);
    let user;
    //make sure item is a .result-item, rather than a child of it
    if (item[0].className && item[0].className !== 'result-item') {
      item = $(item).parent('.result-item')[0];
    }
    //get user's name
    user = $(item).children('.result-user')[0].textContent;
    //append to the comment box
    $('.comment-block').val((i, value) => {
      return `${value} ${user} `;
    });
    $('#widget').hide();
    $(document).trigger('resetSearch');
  }
  
  createItem(users) {
    //remove previous results
    $('#widget').empty();
    
    //go through current results
    users.map((user, i) => {
      const item = `<div class="result-item" data-result-id="${i}">
                      <img src="${user.avatar_url}" alt="user profile pictures" class="result-img"/>    
                      <p class="result-user">${user.name}</p>
                    </div>`;
      $('#widget').append(item);
    });
    
    this.attachItemListeners('.result-item');
    $('#widget').show();
  }
  
  setState(addToState) {
    this.state = Object.assign({}, this.state, addToState);
  }
}

//on load, create an instance of the UserWidget class
document.addEventListener('DOMContentLoaded', ()=> {
  const widget = new UserWidget('#widget');
});