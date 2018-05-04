var duration = 60 * 10;
var base = 'EUR';

window.addEventListener("load", [getRates(), startTimer(duration)]);

function getRates() 
{
    var api = 'http://data.fixer.io/api/latest';
    var key = '2f0973b4624030ef31db2a8988f32d4b';
    var url = api + '?access_key=' + key + '&base=' + base;

    var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if(xhr.readyState < 4) {
                showLoading();
            }
            if(xhr.readyState == 4 && xhr.status == 200) {
                outputRates(xhr.responseText);
                document.getElementById('message').innerHTML = Date();
            }
        };
        xhr.send();
}

function showLoading() 
{
    var target = document.getElementById('time');
}

function outputRates(data) 
{   
    document.getElementById('mySelect').innerHTML = null;
    document.getElementById('list').innerHTML = null;

    var json = JSON.parse(data);
    var rates = json.rates;
    var sortedRates = sortByKey(rates);
        for (var i in sortedRates) {
            outputRatesDropdown(sortedRates[i][0], sortedRates[i][1]);
            outputRatesList(sortedRates[i][0], sortedRates[i][1]);
        }
}

function sortByKey(rates)
{
    var sortedArray = [];

        for(var i in rates){
            sortedArray.push([i, rates[i]]);
        }
        return sortedArray.sort();
}

function outputRatesDropdown(c_code, rate)
{   
    var target = document.getElementById('mySelect');
    var option = document.createElement("option");
        option.text = c_code;
        option.value = rate;

        target.add(option);    
}

function outputRatesList(c_code, rate)
{   
    var target = document.getElementById('list');
        target.innerHTML += '<li><b>' + c_code + "</b> " + rate + '</li>';
}

function calculate()
{   
    var rate = getSelectedRate();
    var c_code = getSelectedC_code();
    var value = document.getElementById('convert_me').value;
    var result = value  * rate;

        document.getElementById('result').value = result + c_code

        setHistory(rate, value, result, c_code);
        setCookie(rate, value, result, c_code);
                
}

function getSelectedRate() 
{
    var selector = document.getElementById('mySelect');
    var rate = selector[selector.selectedIndex].value;

        return rate;
}

function getSelectedC_code() 
{
    var selector = document.getElementById('mySelect');
    var c_code = selector[selector.selectedIndex].text;

        return c_code;
}

function setCookie(rate, value, result, c_code)
{   
    document.cookie += " At this time " + new Date() +  " Conversion rate: " + rate + " This many: " + value + base + " Result: " + result + c_code + "\n";   
}

function setHistory(rate, value, result, c_code)
{   
    var selector = document.getElementById('history');
        return selector.innerHTML += "<li class='list-group-item'>" + " Converting: " + value + base + " To: " + c_code + " Result: " + result + c_code + "</li>";    
}

function startTimer(duration) 
{   
    var display = document.getElementById('time');
    var timer = duration, minutes, seconds;
    var timerStart = setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.innerHTML = minutes + ":" + seconds;

        if (--timer < 0) {
            timerReset(timerStart);
            getRates();
        }
    }, 1000);
    
}

function timerReset(timerStart)
{
    clearInterval(timerStart);
    startTimer(duration);
}