//initialize firebase
var config = {
  apiKey: "AIzaSyDkZwvls218lxIPdKeYWtqihDevkNnYBBE",
  authDomain: "train-scheduler-2e255.firebaseapp.com",
  databaseURL: "https://train-scheduler-2e255.firebaseio.com",
  projectId: "train-scheduler-2e255",
  storageBucket: "",
  messagingSenderId: "483953810255"
};
firebase.initializeApp(config);

//Get the database service for the default app
var database = firebase.database();

//On click function to add a new train
$('#addTrainButton').on('click', function(event) {

  //grabs the value of the user input and assigns it to variables
  var trainName = $('#name').val().trim();
  var destination = $('#destination').val().trim();
  var firstTrainTime = $('#time').val().trim();
  var frequency = $('#frequency').val().trim();

  // Creates local temporary object for holding data
  var train = {
		name: trainName,
		destination: destination,
		firstTrainTime: firstTrainTime,
		frequency: frequency
	}
  //push the info to the database
  database.ref().push(train);

	console.log(train.name);
	console.log(train.destination);
	console.log(train.firstTrainTime);
	console.log(train.frequency);

  //clear the form
  $("#name").val('');
  $("#destination").val('');
  $("#time").val('');
  $("#frequency").val('');

  event.preventDefault();
});

//limitToLast method found on Firebase website, only works when page is refreshed
database.ref().orderByChild('TIMESTAMP').limitToLast(4).on("child_added", function(snapshot) {
  console.log(snapshot.val());

  var trainName = snapshot.val().name;
	var destination = snapshot.val().destination;
	var firstTrain = snapshot.val().firstTrainTime;
	var frequency = snapshot.val().frequency;

  var currentTime = moment();
  var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  var tRemainder = diffTime % frequency;
  var tMinutesTillTrain = frequency - tRemainder;
  var nextTrain = moment().add(tMinutesTillTrain, "minutes").format('HH:mm');

  $(".table > tbody").append('<tr><td>'+trainName+'</td><td>'+destination+'</td><td>'+frequency+'</td><td>'+nextTrain+'</td><td>'+tMinutesTillTrain+'</td><tr>');

});
//This function will update the arrival time every minute. I found an example of this on stack overflow.
setInterval(function(){
  location.reload();
}, 60000)
