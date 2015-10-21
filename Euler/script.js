var addToPage = function(answer){
	var list = document.getElementById('solutions');
	var item = document.createElement('li');
			item.innerHTML = answer;
	list.appendChild(item);
}

var problemOne = function(num){
	var sum = 0;

	var i = 1
	while(i < num){
		if(i%3 == 0 || i%5 == 0){
			sum += i;
		}
		i+=1;
	}
	return sum;
}

addToPage(problemOne(1000))

var problemTwo = function(num){
	var sequence = [1,2];
	var newNum = 0;
	var sum = 2;
	while(newNum <= num){
		var last = sequence[sequence.length-2];
		var nextToLast = sequence[sequence.length-1];
		var newNum = last + nextToLast;
		sequence.push(newNum);
		if(newNum%2 == 0){
			sum += newNum;
		}
	}
	return sum;
}

addToPage(problemTwo(4000000))
