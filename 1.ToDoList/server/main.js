import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  Todos = new Mongo.Collection('todos');
    

});

Meteor.publish('todos', function(){
    return Todos.find({userId: this.userId});
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