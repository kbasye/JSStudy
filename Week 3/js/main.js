function Planter(){
	this.container = document.getElementById('tree-planter');
	this.plantButton = document.getElementById("plant-trees");
	this.stockLabel = document.getElementById('stock-label');
	this.growButton = document.getElementById("grow-trees");
	this.stock = 6;

	this.showGrowButton = function(){
		this.growButton.setAttribute('style', 'display:block');
	}

	this.showStockLabel = function(){
		this.stockLabel.innerHTML = "You have " + this.stock.toString() + " trees left to plant."
		this.stockLabel.setAttribute('style', 'display:block');
	}

	this.countDown = function(){
		this.stock -= 1;
		this.stockLabel.innerHTML = "You have " + this.stock.toString()+" trees left to plant.";
	}

	this.outOfSeeds = function(){
		this.plantButton.disabled = true;
		this.plantButton.innerHTML = "Done Planting";
	}

	this.finishGrowing = function(){
		this.growButton.disabled = true;
		this.growButton.innerHTML = "Done Growing";
		var label = document.createElement('p');
			label.innerHTML = "Your trees are done growing."
		this.container.appendChild(label);
	}
}

function Orchard(){
	this.land = document.getElementById("orchard");
	this.trees = [];

	this.plant = function(tree){
		this.trees.push(tree);
		this.land.appendChild(tree.sapling());
	}
	this.grow = function(){
		for (var i = this.trees.length - 1; i >= 0; i--) {
			this.trees[i].grow();
		};
	}
}

function Tree(type, id){
	this.id = id;
	this.type = type;
	this.fruit = [];
	this.height = 15;
	this.width = 5;
	this.elClass = "tree "+this.type;

	this.sapling = function(){
		var treeContainer = document.createElement('div');
			treeContainer.className = "col span_2_of_12";
		var treeLabel = document.createElement('p');
			treeLabel.innerHTML = this.type;
		var tree = document.createElement("div");
			tree.className = this.elClass;
			tree.setAttribute('id', this.id);
			tree.setAttribute("style", "width:"+this.width.toString()+"px;height:"+this.height.toString()+"px;");
		treeContainer.appendChild(treeLabel);
		treeContainer.appendChild(tree);
		return treeContainer;
	}
	this.grow = function(){
		this.width += Math.floor((Math.random() * 10) + 1);
		this.height += Math.floor((Math.random() * 10) + 1)*10;
		document.getElementById(this.id).setAttribute("style", "width:"+this.width.toString()+"px;height:"+this.height.toString()+"px;");
	}
}

function Fruit(){
	
}

// Driver Code

var orchard = new Orchard();
var planter = new Planter();
	planter.showStockLabel();

// Plant tree
document.getElementById("plant-trees").addEventListener("click", function(){
	planter.countDown();
	if(planter.stock >= 0){
		var selectTag = document.getElementsByName('name')[0];
		var fruitType = selectTag.options[selectTag.selectedIndex].value;
		var tree = new Tree(fruitType, planter.stock+1);
		orchard.plant(tree);
	}
	if(planter.stock == 0){
		planter.outOfSeeds();
		planter.showGrowButton();
	}
});

// Grow tree
document.getElementById("grow-trees").addEventListener("click", function(){
	for (var i = orchard.trees.length - 1; i >= 0; i--) {
		if(orchard.trees[i].height <= 350){
			orchard.trees[i].grow();
		}
		else{
			planter.finishGrowing();
		}
	};
})