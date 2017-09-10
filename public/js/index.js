var socket = io();
socket.on('connect', () => {
  console.log('Welcome, Your client id is: %s', socket.id);

  socket.on('newMessage', function (messageData) {
    var li = jQuery('<li></li>');
    var userName = messageData.from ? messageData.from : 'Anonymous';
    li.text(`At ${messageData.createdAt} ${userName} said: ${messageData.message}`);

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

var submitDestination = jQuery('#submitDestination');
submitDestination.on('click', function (e) {
  var from = jQuery('[name=travelFrom]').val();
  fetchAddressWithCoords(from, function(fromAddressWithCoords) {
    var fromMessage = fromAddressWithCoords ? `${fromAddressWithCoords.formattedAddress} at ${fromAddressWithCoords.latitude},${fromAddressWithCoords.longitude}`
                                            : 'Enter valid starting point';
    jQuery('#from').text(fromMessage);
  });

  var to = jQuery('[name=travelTo]').val();
  fetchAddressWithCoords(to, function(toAddressWithCoords) {

    if(toAddressWithCoords) {
      var geoWithLink = jQuery('<a target="_blank">coordinates are </a>');
      geoWithLink.append(`${toAddressWithCoords.latitude},${toAddressWithCoords.longitude} (Open in google maps)`);
      geoWithLink.attr('href', `https://www.google.com/maps?q=${toAddressWithCoords.latitude},${toAddressWithCoords.longitude}`);
      jQuery('#to').text(`${toAddressWithCoords.formattedAddress}, `).append(geoWithLink);
    } else {
      jQuery('#to').text('Enter valid destination');
    }

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
        callback({
          formattedAddress,
          latitude,
          longitude
        });
    })
    .catch(function(error) {
      callback();
    });
}

});
