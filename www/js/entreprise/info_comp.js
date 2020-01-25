/*global obstir _config*/

var obstir = window.obstir || {};
obstir.map = obstir.map || {};

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

    // function uploadS3() {
    //     AWS.config.update({
    //         credentials: new AWS.CognitoIdentityCredentials({
    //             userPoolId: 'eu-west-1_32YYqyoDa', 
    //             userPoolClientId: '1si9stk1jabvnsjh6lr7emm58h', 
    //             region: 'eu-west-1',
    //             Token:obstir.authToken
    //         })
    //     });
    //     var s3 = new AWS.S3();
 
    //     var files = document.getElementById('cartepro').files;
    //     file=files[0];
    //     var params = {
    //       Bucket: "26e6bac0-28e4-41d9-a182-f1280ffb4173",
    //       Key: file.name,
    //       Body: file
    //     };
      
    //     s3.upload(params, function(err, data) {
    //       if (err) {
    //         console.log(err, err.stack);
    //         showModal('Failed to upload', 'Network Error. Please contact admin.');
    //       } else {
    //         console.log(data.key + ' successfully uploaded to' + data.Location);
    //         showModal('Upload Success!', data.key + ' successfully uploaded!');
    //       }
    //     });
    // }
    function maj_complement_info() {
       
        var datalist={
                InputNom: window.document.getElementById("InputNom").value,
                InputPrenom: window.document.getElementById("InputPrenom").value,
                InputTypeRoute: window.document.getElementById("InputTypeRoute").value,
                InputNumeroRue: window.document.getElementById("InputNumeroRue").valueAsNumber,
                InputCodePostal: window.document.getElementById("InputCodePostal").valueAsNumber,
                InputVille: window.document.getElementById("InputVille").value,
                InputPays: window.document.getElementById("InputPays").value,
                InputPhoneNumber: window.document.getElementById("InputPhoneNumber").valueAsNumber
            }
        var  donnees= {"Donnees_complementaires": datalist}
        var monjson=JSON.stringify(donnees)
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/ride',
            headers: {
                Authorization: authToken
            },
            data: "{\"Donnees_complementaires\":{\"InputNom\":\"iiji\",\"InputPrenom\":\"poij\",\"InputTypeRoute\":\"Rue\",\"InputNumeroRue\":\"21\",\"InputCodePostal\":\"98\",\"InputVille\":\"kjk\",\"InputPays\":\"joj\",\"InputPhoneNumber\":\"0651086790\"}}",
            //JSON.stringify(donnees),
            contentType: 'application/json',
            success: completeRequest,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when requesting your unicorn:\n' + jqXHR.responseText);
            }
        });
    }

    function uploadS3() {
        var url="https://26e6bac0-28e4-41d9-a182-f1280ffb4173.s3-eu-west-1.amazonaws.com/Jira.jpg"
        var image_file ="C:/Users/D/projets/idees/Jira.jpg" 
        //document.getElementById('cartepro').files[0];
        var formData = new FormData();
        formData.append("image_file", image_file)
        $.ajax({
            method: 'PUT',
            url: url,
            headers: {
                //Authorization: authToken
            },
            data: formData,
            contentType: false,
            processData: false,
            async:false,
            success: completeRequest,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error uploading: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when uploading image:\n' + jqXHR.responseText);
            }
        });
    }

    function completeRequest(result) {
        var unicorn;
        var pronoun;
        console.log('Response received from API: ', result);
        unicorn = result.Unicorn;
        pronoun = unicorn.Gender === 'Male' ? 'his' : 'her';
        displayUpdate(unicorn.Name + ', your ' + unicorn.Color + ' unicorn, is on ' + pronoun + ' way.');
        animateArrival(function animateCallback() {
            displayUpdate(unicorn.Name + ' has arrived. Giddy up!');
            obstir.map.unsetLocation();
            $('#request').prop('disabled', 'disabled');
            $('#request').text('Set Pickup');
        });
    }

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

    function handlePickupChanged() {
        var requestButton = $('#request');
        requestButton.text('Enregistrer');
        requestButton.prop('disabled', false);
    }

    function handleRequestClick(event) {
        // var info_comp = obstir.map.selectedPoint;
        event.preventDefault();
        maj_complement_info();
        //uploadS3();
        
    }

    function animateArrival(callback) {
        var dest = obstir.map.selectedPoint;
        var origin = {};

        if (dest.latitude > obstir.map.center.latitude) {
            origin.latitude = obstir.map.extent.minLat;
        } else {
            origin.latitude = obstir.map.extent.maxLat;
        }

        if (dest.longitude > obstir.map.center.longitude) {
            origin.longitude = obstir.map.extent.minLng;
        } else {
            origin.longitude = obstir.map.extent.maxLng;
        }

        obstir.map.animate(origin, dest, callback);
    }

    function displayUpdate(text) {
        $('#updates').append($('<li>' + text + '</li>'));
    }
}(jQuery));
