var today = moment().format('[(]DD[/]MM[/]YYYY[)]');
var nextDay = moment().format('YYYY[-]MM[-]DD');

console.log(nextDay);

var APIKey = "3dc985fa62d85c8918392dfbcb834bd2";
var searchedCity = "";


// event listener that runs the function when search button is clicked
$("#search-button").on("click", function (event) {

    event.preventDefault();

    var searchedCity = $("#search-input").val();


    todaysWeather(searchedCity);
    saveToLocalStorage(searchedCity);
});

//function to show the weather on the day
function todaysWeather(searchedCity) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchedCity + "&appid=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        $("#today").empty()
        $("#forecast").empty()
        var celcius = tempConvert(response.main.temp);
        var cityMain1 = $("<div col-12>").append($("<p><h2>" + response.name + " " + today + "</h2><p>"));
        cityMain1.addClass('border border-dark p-1')
        var image = $('<img>').attr('src', 'http://openweathermap.org/img/w/' + response.weather[0].icon + '.png');
        var degreeMain = $('<p>').text('Temp: ' + celcius + '°C');
        var humidityMain = $('<p>').text('Humidity : ' + response.main.humidity + '%');
        var windMain = $('<p>').text('Wind: ' + response.wind.speed + 'KPH');

        weatherForecast(searchedCity);

        cityMain1.append(image).append(degreeMain).append(windMain).append(humidityMain);
        $('#today').empty();
        $('#today').append(cityMain1);

    });
}

// converting Kelvin to Ceslsius
function tempConvert(kelvin) {
    var celcius = (kelvin - 273.15).toFixed(2);
    return celcius;
};

// function to display the 5days forecast

function weatherForecast(searchedCity) {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchedCity + "&appid=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var forecastArray = response.list;
        console.log(forecastArray);

        for (var i = 0; i < forecastArray.length; i++){
            if (forecastArray[i].dt_txt.split(' ')[1] === '12:00:00') {
                var celcius = tempConvert(forecastArray[i].main.temp);
                var mainCity = $('<div>');
                mainCity.addClass('col forecast bg-primary text-white ml-3 mb-3 rounded');
                var date = $('<h5>').text(response.list[i].dt_txt.split(" ")[0]);
                var image = $('<img>').attr('src', 'http://openweathermap.org/img/w/' + forecastArray[i].weather[0].icon + '.png');
                var degreeMain = $('<p>').text('Temp : '+ celcius + '°C');               
                var humidityMain = $('<p>').text('Humidity : ' + forecastArray[i].main.humidity + '%');
                var windMain = $('<p>').text('Wind : ' + forecastArray[i].wind.speed + 'KPH');                
                mainCity.append(date).append(image).append(degreeMain).append(windMain).append(humidityMain);
                $('#forecast').append(mainCity);
            }
        }
    });
};



// function to create button for searched city
function searchedCityButton(searchedCity) {
    var div = $('<div>');
    var btn = $('<button>');

    btn.attr('id', 'new-button');
    btn.addClass('btn btn-secondary');
    btn.text(searchedCity);
    div.append(btn);
    div.addClass('list-group p-1')
    $('#history').prepend(div);
    $('#new-button').on('click', function () {
        var thisCity = $(this).text();
        todaysWeather(thisCity);
    })
};

//function to save city's data to local storage
function saveToLocalStorage(searchedCity) {
    var saved = localStorage.getItem('cities');

    if (saved) {
        console.log(saved, searchedCity);
    } else {
        saved = searchedCity;
        localStorage.setItem('cities', saved)
    }
    if (saved.indexOf(searchedCity) === -1) {
        saved = saved + "," + searchedCity;
        localStorage.setItem('cities', saved)
        searchedCityButton(searchedCity);
    }
};

//function that persists data
function getLocalStorage() {
    var storedCities = localStorage.getItem('cities')
    var cityArray = [];

    if (!storedCities) {
        return;
    } else {
        storedCities.trim();
        cityArray = storedCities.split(',');
        for (var i = 0; i < cityArray.length; i++) {
            searchedCityButton(cityArray[i]);
        }
    }
};

getLocalStorage();