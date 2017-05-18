class Weather {
    constructor(options) {
        console.info('in constr');
        this.latitude = "";
        this.longitude = "";
        this.apiKey = options.apiKey;

        this.weather = {};

        this.init();
    }

    init() {
        console.info('init');
        this.TimeCheck();
        //this.getMyLocation();
        //this.getFromCache();
    }

    getMyLocation() {
        var that = this;
        navigator.geolocation.getCurrentPosition(function (position) {
            that.latitude = position.coords.latitude;
            that.longitude = position.coords.longitude;
            that.getWeather();
        });
    }

    getWeather() {
        var that = this;
        console.info('get weather');
        const call = `https://api.darksky.net/forecast/${this.apiKey}/${this.latitude},${this.longitude}?units=ca`
        $.ajax({
            method: "GET",
            url: call,
            dataType: "jsonp"
        }).done(function (response) {
            that.weather = response.currently;
            that.updateUI();
            that.storeInCache();
        });
    }

    updateUI() {
        console.log('updating UI');

        var color;
        if (this.weather.temperature < 15) {
            color = '#87CEFA';
            $('#app ').append(`<h1>${Math.round(this.weather.temperature)}°</h1>`);
            $('#app ').append(`<img src="./img/boot.gif">`);
            $('#app ').append(`<h2>Mackerel skies and Mare"s tails make tall ships carry low sails</h2>`);
        } else{
            color = '#faac45';
            $('#app ').append(`<h1>${Math.round(this.weather.temperature)}°</h1>`);
            $('#app ').append(`<img src="./img/Spider.gif">`);
            $('#app ').append(`<h2>If spiders are many and spinning their web, the spell will soon be very dry</h2>`);
        }
        $('#app').css('background-color', color);
    }

    storeInCache() {
        console.log("Storing data in cache");
        localStorage.setItem("weather", this.weather.temperature);
        var DateCached = new Date();
        localStorage.setItem("TimeCached", DateCached);
    }

    getFromCache() {
        console.log("Getting data from cache");
        this.weather.temperature = localStorage.getItem("weather");
        this.updateUI();
    }

    TimeCheck(){
        console.log("checking time between now and cached time");
        var DateNow = new Date();
        var DateCached = new Date(localStorage.getItem("TimeCached"));

        if(DateCached == null){
            console.log("nothing hass been cached yet, caching now");
            this.getMyLocation();
        }
        else{
            console.log("datecached has been set");
            var DateNowInHours = DateNow.getMinutes();
            var DateCachedInHours = DateCached.getMinutes();

            if(DateNowInHours != DateCachedInHours){
                console.log("its been more then an hour, reseting api");
                this.getMyLocation();
            }
            else{
                console.log("its been less then an hour, not resetting api");
                this.getFromCache();
            }
        }
    }

}

const options = {
    'apiKey': '585e52af6ee72e1839f4ac13d356d601',
    'el': '#app'
}

const App = new Weather(options);