 // Your web app's Firebase configuration
 var firebaseConfig = {
    apiKey: "AIzaSyBTPwLGvWuFhZrFam_46FGqGF7_UftXqPY",
    authDomain: "june-project-b93a5.firebaseapp.com",
    databaseURL: "https://june-project-b93a5.firebaseio.com",
    projectId: "june-project-b93a5",
    storageBucket: "june-project-b93a5.appspot.com",
    messagingSenderId: "881521357384",
    appId: "1:881521357384:web:76fb77061d3dcade"
  };
  // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    

    var database = firebase.database();

    // Initial values

    var currentTime = "";
    var trainName = "";
    var trainDestinaiton = "";
    var trainTime = "";
    var trainFrequency = "";
    var timeDifference = "";
    var nextArrival = 0;
    var minAway = 0;
    var timeRemainder = 0;
    var newTrain = {
        name: trainName,
        destination: trainDestinaiton,
        frequency: trainFrequency,
        firstTrain: trainTime,
    }
    var trainInput = "";

    $("#add-train-data").on("click", function (event) {
        event.preventDefault();

        firstTrain = moment($("#train-time").val().trim(), "HH:mm").format("HH:mm");

        if (trainInput !== 'Invalid date') {
            newTrain.name = $("#train-name").val().trim();
            newTrain.destination = $("#train-destination").val().trim();
            newTrain.firstTrain = firstTrain;
            newTrain.frequency = $("#train-freq").val().trim();
        } else {
            alert("Enter a valid train time!")
            clearInput();
        }

        // push to firebase
        database.ref().push(newTrain);

        clearInput();
    });

    function clearInput(){
        $("#train-name").val("");
        $("#train-destination").val("");
        $("#train-time").val("");
        $("#train-freq").val("");
    }

    // Creates the table with Train data and performs calculations for Next Arrival and Minutes Away
    database.ref().on("child_added", function (snapshot) {
        
        if (trainInput !== 'Invalid date') {
            trainName = snapshot.val().name;
            trainDestinaiton = snapshot.val().destination;
            trainTime = moment(snapshot.val().firstTrain, "HH:mm");
            trainFrequency = snapshot.val().frequency;

           
            var trainTimeConverted = moment(trainTime, "HH:mm");

            currentTime = moment().format("HH:mm");
            console.log("Current Time: " + currentTime);

            timeDifference = moment().diff(moment(trainTimeConverted), "minutes");
            console.log("Time remaining: " + timeDifference);

            timeRemainder = timeDifference % trainFrequency;
            console.log("Remaining Time: " + timeRemainder);

            minAway = trainFrequency - timeRemainder;
            console.log(minAway);

            nextArrival = moment().add(minAway, "minutes").format("LT");

            $("#trainData").append("<tr><td>" + trainName + "</td><td>" + trainDestinaiton + "</td><td>" + trainFrequency + "</td><td>" + nextArrival + "</td><td>" + minAway + "</td></tr>");
        }
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });