document.getElementById('previous').style.display = "none";

function getCoords(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            var lat = position.coords.latitude;
            var long = position.coords.longitude;
        
            getLocation(lat, long);
        });
    }
}

getCoords();

function getLocation(lat, long){
    var locAPI= 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&key=AIzaSyBTvp4Hhy_n_gNK0mpbf3eeTziqReON0os';

        $.get({
            url : locAPI,
            success : function(data){
    
                if(data.status == "OK"){
    
                var city = document.getElementById("cityName");
                city.innerHTML = data.results[0].address_components[3].long_name;

                }else{
                    alert("Error!");
                }
            }
        });
    getWeather(lat, long);
}

function skycons(iconName) {
    var skycons = new Skycons({"color": "black"});
    skycons.add(document.getElementById('icon'), iconName);
    skycons.play();
}

function getWeather(lat, long){
    var time = parseInt(new Date().getTime()/1000);
    
    var darkskyAPI="https://api.darksky.net/forecast/3da09c98b60ad5e4e3fb37a123597bf3/"+lat+","+long+","+time+"?lang=uk";

    getCurrentDate(time,0);

    getTodayWeather(darkskyAPI);

    var dayId = 0;
    
        document.getElementById('next').addEventListener('click', function(ev){
            ev.preventDefault();
            document.getElementById('previous').style.display = "block";

            if(dayId < 7){
                dayId+=1;

                getCurrentDate(time,1);

                time+=86400;

                darkskyAPI="https://api.darksky.net/forecast/3da09c98b60ad5e4e3fb37a123597bf3/"+lat+","+long+","+time+"?lang=uk";
                getNextDayWeather(darkskyAPI);
            }

            if(dayId === 7){
                document.getElementById('next').style.display = "none";
                }
        }); 

        document.getElementById('previous').addEventListener('click', function(ev){
            ev.preventDefault();

            if(dayId === 7){
                document.getElementById('next').style.display = "block";
            }

            if(dayId > 0){
                dayId-=1;
                console.log(dayId);

                getCurrentDate(time,-1);
                time-=86400;
    
                darkskyAPI="https://api.darksky.net/forecast/3da09c98b60ad5e4e3fb37a123597bf3/"+lat+","+long+","+time+"?lang=uk";
                if(dayId === 0){
                    document.getElementById('previous').style.display = "none";
                    getTodayWeather(darkskyAPI);
                }else{
                    getNextDayWeather(darkskyAPI);
                }
               
             }
        }); 
    }

function getTodayWeather(darkskyAPI){
    $.get({
        url : darkskyAPI, 
        dataType: "jsonp",
        success: function( response ) {
            console.log(response);
            var temperature = response.currently.temperature;
            var summary = response.currently.summary;
            var windSpeed = response.currently.windSpeed;
            var pressure = response.currently.pressure;
            var maxTemp = response.daily.data[0].apparentTemperatureHigh;
            var minTemp = response.daily.data[0].apparentTemperatureLow;

            document.getElementById("temp").innerHTML = convert(temperature).toFixed(0) + "°C";
            document.getElementById("weather-condition").innerHTML =  summary;
            document.getElementById("windSpeed").innerHTML = "швидкість вітру: " + windSpeed + " км/год";
            document.getElementById("pressure").innerHTML = "тиск: " + pressure + " Гп";
            document.getElementById('max').innerHTML = 'макс: ' +  convert(maxTemp).toFixed(0) + "°C";
            document.getElementById('min').innerHTML = 'мін: ' +  convert(minTemp).toFixed(0) + "°C";

            skycons(response.currently.icon);  
        }
    });
}

function getNextDayWeather(darkskyAPI){
    $.get({
        url : darkskyAPI, 
        dataType: "jsonp",
        success: function( response ) {
            console.log(response);

            var summary = response.daily.data[0].summary;
            var windSpeed = response.daily.data[0].windSpeed;
            var pressure = response.daily.data[0].pressure;
            var maxTemp = response.daily.data[0].apparentTemperatureHigh;
            var minTemp = response.daily.data[0].apparentTemperatureLow;
            var avgTemp = (maxTemp+minTemp)/2;

            document.getElementById("temp").innerHTML = convert(avgTemp).toFixed(0) + "°C";
            document.getElementById("weather-condition").innerHTML =  summary;
            document.getElementById("windSpeed").innerHTML = "швидкість вітру: " + windSpeed + " км/год";
            document.getElementById("pressure").innerHTML = "тиск: " + pressure + " Гп";
            document.getElementById('max').innerHTML = 'макс: ' +  convert(maxTemp).toFixed(0) + "°C";
            document.getElementById('min').innerHTML = 'мін: ' +  convert(minTemp).toFixed(0) + "°C";

            skycons(response.daily.data[0].icon);  
        }
    });
}

function convert(far){
    var cel = (far-32) / 1.8;
    return cel;
}

function getCurrentDate(timestamp,i){
    var today = new Date(timestamp*1000);
    var yyyy = today.getFullYear();
	var mm = ('0' + (today.getMonth() + 1)).slice(-2);
    var dd = +('0' + today.getDate()).slice(-2);

    dd = dd + i;

    if(dd == 32){
        dd=1;
    }else if(dd==0){
        dd=31;
    }

    if(dd<10){
        dd='0'+dd;
    }
   
    var today = dd+'.'+mm+'.'+yyyy;
    
    document.getElementById('date').innerHTML = today;

    return today;
}




