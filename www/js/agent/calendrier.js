var obstir = window.obstir || {};

$(document).ready(function() {
    var authToken;
    obstir.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
        } else {
            window.location.href = '../agent/oauth.html';
        }
    }).catch(function handleTokenError(error) {
        alert(error);
        window.location.href = '/../agent/oauth.html';
    });

    var calendar = $('#calendar').fullCalendar({
        editable: true,
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        events: function(){
                              $.ajax({
                    method: 'POST',
                    url: _config.api.invokeUrl + 'c',
                    headers: {
                        Authorization: 'Bearer ' + authToken
                    },
                    success: function(back) {
                        calendar.fullCalendar('refetchEvents');
                        alert("Added Successfully");
                    },
                    error: function ajaxError(jqXHR, textStatus, errorThrown) {
                        console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
                        console.error('Response: ', jqXHR.responseText);
                        alert('An error occured when requesting your unicorn:\n' + jqXHR.responseText);
                    }
                });
        },
        selectable: true,
        selectHelper: true,
        select: function(start, end, allDay) {
            var title = prompt("Enter Event Title");
            if (title) {
                var start = $.fullCalendar.formatDate(start, "Y-MM-DD HH:mm:ss");
                var end = $.fullCalendar.formatDate(end, "Y-MM-DD HH:mm:ss");
                $.ajax({
                    method: 'POST',
                    url: _config.api.invokeUrl + 'c',
                    headers: {
                        Authorization: 'Bearer ' + authToken
                    },
                    data: JSON.stringify({
                        action: "update",
                        data: {
                            title: title,
                            start: start,
                            end: end
                        }
                    }),
                    contentType: 'application/json',
                    success: function() {
                        calendar.fullCalendar('refetchEvents');
                        alert("Added Successfully");
                    },
                    error: function ajaxError(jqXHR, textStatus, errorThrown) {
                        console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
                        console.error('Response: ', jqXHR.responseText);
                        alert('An error occured when requesting your unicorn:\n' + jqXHR.responseText);
                    }
                });
            }
        },
        editable: true,
        eventResize: function(event) {
            var start = $.fullCalendar.formatDate(event.start, "Y-MM-DD HH:mm:ss");
            var end = $.fullCalendar.formatDate(event.end, "Y-MM-DD HH:mm:ss");
            var title = event.title;
            var id = event.id;
            $.ajax({
                url: "update.js",
                type: "POST",
                data: {
                    title: title,
                    start: start,
                    end: end,
                    id: id
                },
                success: function() {
                    calendar.fullCalendar('refetchEvents');
                    alert('Event Update');
                }
            })
        },

        eventDrop: function(event) {
            var start = $.fullCalendar.formatDate(event.start, "Y-MM-DD HH:mm:ss");
            var end = $.fullCalendar.formatDate(event.end, "Y-MM-DD HH:mm:ss");
            var title = event.title;
            var id = event.id;
            $.ajax({
                url: "update.php",
                type: "POST",
                data: {
                    title: title,
                    start: start,
                    end: end,
                    id: id
                },
                success: function() {
                    calendar.fullCalendar('refetchEvents');
                    alert("Event Updated");
                }
            });
        },

        eventClick: function(event) {
            if (confirm("Are you sure you want to remove it?")) {
                var id = event.id;
                $.ajax({
                    url: "delete.php",
                    type: "POST",
                    data: {
                        id: id
                    },
                    success: function() {
                        calendar.fullCalendar('refetchEvents');
                        alert("Event Removed");
                    }
                })
            }
        },

    });
});