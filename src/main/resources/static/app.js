var stompClient = null;
var myHeaders = new Headers();
myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:8082');
myHeaders.append('Access-Control-Allow-Credentials', 'true');

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    var socket = new SockJS('http://localhost:8080/endpoint');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/greetings', function (greeting) {
            showGreeting(JSON.parse(greeting.body).content);
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    var date = "|001|"+$("#date").val();
    var id = "|002|"+$("#id").val();
    var name = "|003|"+$("#name").val();
    var state = "|004|"+$("#state").val();
    var bravery = "|005|"+$("#bravery").val();
    var low = "|006|"+$("#low").val()+"|";
    var res = `${date}${id}${name}${state}${bravery}${low}`;

    stompClient.send("/app/hello", {}, JSON.stringify(
    {
    'date': $("#date").val(),
    'id': $("#id").val(),
    'name': $("#name").val(),
    'state': $("#state").val(),
    'bravery': $("#bravery").val(),
    'low': $("#low").val()
    }
    ));
}

function showGreeting(message) {
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendName(); });
});
