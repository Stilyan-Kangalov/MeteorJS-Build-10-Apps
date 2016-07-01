import { Template } from 'meteor/templating';

Todos = new Mongo.Collection('todos');

Meteor.subscribe('todos');

Template.main.helpers({
    todos: function(){
        return Todos.find({}, {sort: {createdAt: -1}});
    }
        
});

Template.main.events({
   'submit .new-todo': function(event) {
    var text = event.target.text.value;
    
    Meteor.call('addTodo', text);
       
    // clear the form
    event.target.text.value='';
       
    return false;
   },
    'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value
    Meteor.call('setChecked', this._id, !this.checked);
  },
    'click .delete-todo': function() {
        if(confirm('Are you sure?')){
          Meteor.call('deleteTodo', this._id);
        }
    }
});

Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
});

Meteor.methods({
    addTodo: function(text) {
        if(!Meteor.userId()){
            throw new Meteor.Error('not-authorized');
        }
        Todos.insert({
        text: text,
        createdAt: new Date(),
        userId: Meteor.userId(),
        username: Meteor.user().username    
    });
    },
    deleteTodo: function(todoId){
        Todos.remove(todoId);
    },
    setChecked: function(todoId, setChecked) {
        Todos.update(todoId, {
      $set: { checked: setChecked },
    });
    }
});