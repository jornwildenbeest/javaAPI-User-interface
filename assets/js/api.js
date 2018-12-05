/* TODO: */
// api endpoint maken voor 24 uur geleden in java.
// api request maken naar die endpoint voor grafiek.

// api calls
var devices = "http://192.168.0.106:5000/devices";
var led = "http://192.168.0.106:5000/devices/3";
var menu = $('.nav');
var chart;

var datas = [];

var NewTimeArray = [];
var resultArray = [];

// function to use api.
function useapi(url, methodname) {
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: methodname,
        error: function (xhr, status) {
            console.log("Api request error.");
        }
    });
}

function addMenu(data){
    var counter = 1 ;
    // loop trough data.
    $.each(data, function (key, value) {
        menu.append('\
        <li class="nav-item">\
            <a class="nav-link" href="#" data-id='+ counter +'>' + value.name + '</a>\
        </li>');
        counter++;
    });

    // when menu is loaded, add click function.
    $('.nav li a').each(function (index) {
        $(this).click(function () {
            var navId = $(this).data("id");
            if(navId !== 3){
                // Hide ledController.
                $('.ledController').hide();
                // show chart becuase sensors do have data.
                $('#myChart').show();

                // get device data.
                var deviceurl = devices + "/" + navId;
                var lastdayUrl = devices + "/" + navId + "/lastday";
                console.log(deviceurl);
                // useapi(lastdayUrl, getLastdayData);
                useapi(deviceurl, getData);
                useapi(lastdayUrl, getLastData);
            } else {
                // hide all results because led doesnt has results.
                $('.all-results').hide();
                $('#myChart').hide();

                // clear table.
                $('.data-table tbody').empty();
                // show ledController.
                $('.ledController').show();
            }
            
        })
    });
}

function getData(data) {
    $('.device-info tbody').empty();
    $.each(data, function (key, value) {
        $('.device-info tbody').append('\
        <tr>\
            <th scope="row">'+ key + '</th >\
            <td>'+ value + '</td>\
        </tr>\
        ');
    });
    // remove last item because data is getting showed in chart.
    $('.device-info tbody tr:last-child').remove();


    console.log(data.datas);
    $('.all-results tbody').empty();
    $('.all-results').show();

    for (i = 0; i < data.datas.length; i++) {
        $('.all-results tbody').append('\
        <tr>\
            <td>'+ data.datas[i].time + '</td>\
            <td>'+ data.datas[i].data + '</td>\
        </tr>\
        ');
    }
}

function getLastData(data){
    // put data from last hour to array.
    NewTimeArray = [];
    resultArray = [];

    for (i = 0; i < data.datas.length; i++) {
        var date = new Date(data.datas[i].time);
        var hour = date.getHours() + ":" + date.getMinutes();
        NewTimeArray.push(hour);

        var result = data.datas[i].data;
        resultArray.push(result);
    }

    $('#myChart').empty();
    if (chart !== undefined ){
        chart.destroy();
        console.log("destroy");
    }
    
    createChart();
  
}

function createChart() {
    console.log(NewTimeArray);
    console.log(resultArray);
    var ctx = document.getElementById('myChart').getContext('2d');
    chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',
        // The data for our dataset
        data: {
            labels: NewTimeArray,
            datasets: [{
                label: "temp",
                backgroundColor: 'rgb(255, 99, 132, 0)',
                borderColor: 'rgb(255, 99, 132)',
                data: resultArray,
            }],
        },
    });
}


$(function () {
    useapi(devices, addMenu);

    $('.ledCheckbox').change(function () {
        if (this.checked) {
            console.log("On");
            $(this).prop("checked", true);
            // api call
            // var ledUrl = "http://192.168.178.151:5000/devices/3/on";
            var ledUrl = led + "/on";
            useapi(ledUrl, null);
        } else {
            // api call
            // var ledUrl = "http://192.168.178.151:5000/devices/3/off";
            var ledUrl = led + "/off";
            useapi(ledUrl, null);
            console.log("Off");
        }
    });
});