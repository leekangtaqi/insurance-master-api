let StateMachine = require('../stateMachine')

var fsm = new StateMachine({
  init: 'unlogin',
  transitions: [
    { name: 'melt',     from: 'unlogin',  to: 'login' },
    { name: 'freeze',   from: 'login', to: 'loggedin' },
    { name: 'vaporize', from: 'loggedin', to: 'spide' },
    { name: 'condense', from: 'spide',    to: 'done' }
  ],
  methods: {
    onMelt:     function() { console.log('I melted')    },
    onFreeze:   function() { console.log('I froze')     },
    onVaporize: function() { console.log('I vaporized') },
    onCondense: function() { console.log('I condensed') }
  }
});