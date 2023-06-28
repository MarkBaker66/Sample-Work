function high() {
    var num = document.getElementById('guess').value;
    let roll = Math.floor(Math.random() * 12) +1;
    if (num >=2 && num <=11) {
        if (num < roll){
           document.getElementById('status').innerHTML = 'The roll of the die was:';
           document.getElementById('status2').innerHTML =roll;
           document.getElementById('status3').innerHTML =' You Win!';
        }
        else{
            document.getElementById('status').innerHTML = 'The roll of the die was:';
            document.getElementById('status2').innerHTML =roll;
            document.getElementById('status3').innerHTML = 'You Lose.';
        }
    }
    else
        document.getElementById('status').innerHTML = 'Please enter a valid number.';
}

function low() {
    var num = document.getElementById('guess').value;
    let roll = Math.floor(Math.random() * 12) +1;
    if (num >=2 && num <=11) {
        if (num > roll){
            document.getElementById('status').innerHTML = 'The roll of the die was:';
            document.getElementById('status2').innerHTML =roll;
            document.getElementById('status3').innerHTML =' You Win!';
         }
        else{
            document.getElementById('status').innerHTML = 'The roll of the die was:';
            document.getElementById('status2').innerHTML =roll;
            document.getElementById('status3').innerHTML = 'You Lose.';
        }
    }
    else
        document.getElementById('status').innerHTML = 'Please enter a valid number.';
}