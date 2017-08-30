var socket = io();
socket.on('connect', () => {
  console.log('Welcome, Your client id is: %s', socket.id);

  socket.on('newMessage', function (messageData) {
    console.log('%s %s: %s ~$s', messageData.createdAt, messageData.from, messageData.message);

    var li = jQuery('<li></li>');
    var userName = messageData.from ? messageData.from : 'Anonymous';
    li.text(`${userName}: ${messageData.message}`);

    jQuery('#chatMessages').append(li);
  });

  jQuery('#sendChatMessageButton').on('click', function (e) {
    // e.preventDefault();
    if (jQuery('[name=chatMessage]').val().trim()) {
      socket.emit('createMessage', {
        from: jQuery('[name=userName]').val().trim(),
        message: jQuery('[name=chatMessage]').val()
      });
    }
  });

jQuery('#travelToButton').on('click', function (e) {
  var from = jQuery('[name=travelFrom]').val();
  fetchAddressWithCoords(from, function(fromAddressWithCoords) {
    var fromMessage = fromAddressWithCoords ? fromAddressWithCoords : 'Enter valid starting point';
    jQuery('#from').empty().append(fromMessage);
  });

  var to = jQuery('[name=travelTo]').val();
  fetchAddressWithCoords(to, function(toAddressWithCoords) {
    var toMessage = toAddressWithCoords ? toAddressWithCoords : 'Enter valid destination';
    jQuery('#to').empty().append(toMessage);
  });

});

function fetchAddressWithCoords(place, callback) {
  var googleMapsApiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(place);
  axios.get(googleMapsApiUrl)
    .then(function(response) {
        if (response.data.results.length === 0) {
          throw new Error('Address not found!');
        }
        var formattedAddress = response.data.results[0].formatted_address;
        var latitude = response.data.results[0].geometry.location.lat;
        var longitude = response.data.results[0].geometry.location.lng;
        callback(`${formattedAddress} at position ${latitude},${longitude}`);
    })
    .catch(function(error) {
      callback();
    });
}

});
