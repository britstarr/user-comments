import $ from 'jquery';

class UserWidget {
  constructor(id) {
    this.state = {};
    this.attachListeners();
  }
  
  attachListeners() {
    $(document).on('newMatches', (e, newMatches) => {
      this.createItem(newMatches);
    });
  }
  
  createItem(users) {
    //remove previous results
    $('#widget').empty();
    
    //go through current results
    users.map((user, i) => {
      const item = `<div class="result-item" data-result-id="${i}">
                      <img src="${user.avatar_url}" alt="user profile pictures" class="result-img"/>    
                      <p>${user.name}</p>
                    </div>`;
      $('#widget').append(item);
      $('#widget').show();
    });
  }
  
  setState(addToState) {
    this.state = Object.assign({}, this.state, addToState);
  }
}

document.addEventListener('DOMContentLoaded', ()=> {
  const widget = new UserWidget('#widget');
});