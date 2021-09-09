
function updateCounterDP() {
    const counter_dp = document.getElementById("counter-dp")
    counter_dp.innerText = parseInt(counter_dp.innerText) + 1
}

function clearCounterDP() {
    document.getElementById("counter-dp").innerText = 0
}

function updateCounterDPwithINPUT() {
    let input_val = document.getElementById("num-input").value
    if (isNaN(input_val)) {
        window.alert(`Please enter number only.`);
    } else {
        document.getElementById("counter-dp").innerText = input_val
    }
}