var base = 'EUR';
var duration = 60 * 10;
var timeout, count;


window.addEventListener("load", [getRates(), cdReset()]);

function getRates() {
    var api = 'http://data.fixer.io/api/latest';
    var key = '2f0973b4624030ef31db2a8988f32d4b';
    var url = api + '?access_key=' + key + '&base=' + base;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState < 4) {
            showLoading();
        }
        if (xhr.readyState == 4 && xhr.status == 200) {
            outputRates(xhr.responseText);
            document.getElementById('message').innerHTML = new Date().toLocaleTimeString([], {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }
    };
    xhr.send();
}

function showLoading() {
    var target = document.getElementById('message');
    target.innerHTML = 'Loading...';
}

function outputRates(data) {
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

function sortByKey(rates) {
    var sorted_array = [];
    for (var i in rates) {
        sorted_array.push([i, rates[i]]);
    }
    return sorted_array.sort();
}

function outputRatesDropdown(c_code, rate) {
    var target = document.getElementById('mySelect');
    var option = document.createElement("option");
    option.text = c_code;
    option.value = rate;

    target.add(option);
}

function outputRatesList(c_code, rate) {
    var target = document.getElementById('list');
    target.innerHTML += '<li><b>' + c_code + "</b> " + rate + '</li>';
}

function updateRates() {
    getRates();
    cdReset();
}

function setUtime() {
    duration = document.getElementById('utime').value * 60;
    cdReset();
}

function calculate() {
    var rate = getSelectedRate();
    var c_code = getSelectedC_code();
    var value = document.getElementById('convert_me').value;
    var result = value * rate;

    document.getElementById('result').value = result + c_code

    setHistory(rate, value, result, c_code);
    setCookie(rate, value, result, c_code);
    console.log(document.cookie);
}

function getSelectedRate() {
    var selector = document.getElementById('mySelect');
    var rate = selector[selector.selectedIndex].value;

    return rate;
}

function getSelectedC_code() {
    var selector = document.getElementById('mySelect');
    var c_code = selector[selector.selectedIndex].text;

    return c_code;
}

function setCookie(rate, value, result, c_code) {
    document.cookie += " " + new Date().toLocaleTimeString([], {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }) +
        " " + value + base + " => " + c_code + " = " + result + " " + c_code + "\n";
}

function setHistory(rate, value, result, c_code) {
    var selector = document.getElementById('history');

    return selector.innerHTML += "<li class='list-group-item'>" + value + " <b>" + base + "</b>" + " => " + "<b>" + c_code + "</b>" + " = " + result + " " + "<b>" + c_code + "</b>" + "</li>";
}

function cdDisplay() {
    var display = document.getElementById('time');
    var timer = count,
        minutes, seconds;
    minutes = parseInt(timer / 60, 10)
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.innerHTML = minutes + ":" + seconds;
}

function countdown() {
    cdDisplay();
    if (count < 0) {
        getRates()
        cdReset();
    } else {
        count--;
        timeout = setTimeout("countdown()", 1000);
    }
}

function cdPause() {
    clearTimeout(timeout);
}

function cdReset() {
    cdPause();
    count = duration;
    cdDisplay();
    countdown();
}