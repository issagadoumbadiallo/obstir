/*global obstir _config*/

var obstir = window.obstir || {};

(function rideScopeWrapper($) {
    var authToken;
    obstir.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
        } else {
            window.location.href = '../entreprise/oauth.html';
        }
    }).catch(function handleTokenError(error) {
        alert(error);
        window.location.href = '/../entreprise/oauth.html';
    });
    // function requestUnicorn(pickupLocation) {
    //     $.ajax({
    //         method: 'POST',
    //         url: _config.api.invokeUrl + '/ride',
    //         headers: {
    //             Authorization: authToken
    //         },
    //         data: JSON.stringify({
    //             PickupLocation: {
    //                 Latitude: pickupLocation.latitude,
    //                 Longitude: pickupLocation.longitude
    //             }
    //         }),
    //         contentType: 'application/json',
    //         success: completeRequest,
    //         error: function ajaxError(jqXHR, textStatus, errorThrown) {
    //             console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
    //             console.error('Response: ', jqXHR.responseText);
    //             alert('An error occured when requesting your unicorn:\n' + jqXHR.responseText);
    //         }
    //     });
    // }

    // function completeRequest(result) {
    //     var unicorn;
    //     var pronoun;
    //     console.log('Response received from API: ', result);
    //     unicorn = result.Unicorn;
    //     pronoun = unicorn.Gender === 'Male' ? 'his' : 'her';
    //     displayUpdate(unicorn.Name + ', your ' + unicorn.Color + ' unicorn, is on ' + pronoun + ' way.');
    //     animateArrival(function animateCallback() {
    //         displayUpdate(unicorn.Name + ' has arrived. Giddy up!');
    //         obstir.map.unsetLocation();
    //         $('#request').prop('disabled', 'disabled');
    //         $('#request').text('Set Pickup');
    //     });
    // }

    // Register click handler for #request button
    $(function onDocReady() {
        $('#request').click(handleRequestClick);
        $('#signOut').click(function() {
            obstir.signOut();
            alert("You have been signed out.");
            window.location = "../entreprise/oauth.html";
        });
        $(obstir.map).on('pickupChange', handlePickupChanged);

        obstir.authToken.then(function updateAuthMessage(token) {
            if (token) {
                displayUpdate('You are authenticated. Click to see your <a href="#authTokenModal" data-toggle="modal">auth token</a>.');
                $('.authToken').text(token);
            }
        });

        if (!_config.api.invokeUrl) {
            $('#noApiMessage').show();
        }
    });

    // function handlePickupChanged() {
    //     var requestButton = $('#request');
    //     requestButton.text('Request Unicorn');
    //     requestButton.prop('disabled', false);
    // }

    // function handleRequestClick(event) {
    //     var pickupLocation = obstir.map.selectedPoint;
    //     event.preventDefault();
    //     requestUnicorn(pickupLocation);
    // }

    // function animateArrival(callback) {
    //     var dest = obstir.map.selectedPoint;
    //     var origin = {};

    //     if (dest.latitude > obstir.map.center.latitude) {
    //         origin.latitude = obstir.map.extent.minLat;
    //     } else {
    //         origin.latitude = obstir.map.extent.maxLat;
    //     }

    //     if (dest.longitude > obstir.map.center.longitude) {
    //         origin.longitude = obstir.map.extent.minLng;
    //     } else {
    //         origin.longitude = obstir.map.extent.maxLng;
    //     }

    //     obstir.map.animate(origin, dest, callback);
    // }

    // function displayUpdate(text) {
    //     $('#updates').append($('<li>' + text + '</li>'));
    // }
}(jQuery));
