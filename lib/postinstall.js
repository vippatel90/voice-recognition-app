const fs = require('fs');

const microphoneWithMonoChannelAnd16BitSampling = fs.readFileSync('lib/microphone.js', 'utf8');

fs.writeFileSync('node_modules/recorder-js/lib/microphone.js', microphoneWithMonoChannelAnd16BitSampling, 'utf8', () => {
  console.log('microphone js updated as per this project requirment');
});
