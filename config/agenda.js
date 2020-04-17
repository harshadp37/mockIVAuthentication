const Agenda = require('agenda');
const mongoose = require('mongoose');

const agenda = new Agenda({mongo: mongoose.connection});

agenda.on('start', job => {
    console.log('Job ' + job.attrs.name + ' starting.');
});

agenda.start();

module.exports = agenda;