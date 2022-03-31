//////////////////////////////////* Global Variables *///////////////////////////////////


//Global variables
var dropDowns = false; //drop downs used
var noFeatures = 0;

//////////////////////////////////* Functions *///////////////////////////////////


//Create table function
(function(){

	// Constructor method
	this.CsvToTable = function(){
		this.csvFile = null;

		// Create options by extending defaults with the passed in arugments
    	if (arguments[0] && typeof arguments[0] === "object") {
      		this.options = arguments[0];
    	}

	}

	CsvToTable.prototype.run = function() {
		return buildTable.call(this);
	}

	//Try open csv
	function getCSV() {
		try{
			var csvfile = this.options.csvFile;
			return new Promise(function(resolve, reject) {
				var request = new XMLHttpRequest();
				request.open("GET", csvfile, true);
				request.onload = function() {
				    if (request.status == 200) {
				        resolve(request.response);
				    } else {
				        reject(Error(request.statusText));
				    }
				};

				request.onerror = function() {
				 	reject(Error('Error fetching data.'));
				};
				request.send();
			});
		}catch(err){
			console.error(err);
		}
	}

    function isNotEmpty(row) {
        return row !== "";
    }

    if (!Array.prototype.filter) {
      Array.prototype.filter = function(f) {
        "use strict";
        var p = arguments[1];
        var o = Object(this);
        var len = o.length;
        for (var i = 0; i < len; i++) {
          if (i in o) {
              var v = o[i];
              f.call(p, v, i, o);
          }
        }

        return this;
      };
    }

		//Add company Names to company drop down
	function addCompanyNames(){	
		var table = document.getElementById('myTable');
		var row = table.rows[table.rows.length-2]; //Second last row contains company names
			for (var i = 2, col; col = row.cells[i]; i++){
				$('#company-selectpicker option:nth-child('+(i-1)+')').append('<option class="companyName"> | '+row.cells[i].innerText+'</option>'); //var select = '#bs-select-1-'+(i-2);
			}
		$("#company-selectpicker").selectpicker("refresh");
	};

	//Add flags
	function addFlags() {
		var table = document.getElementById('myTable');
		var row = table.rows[0];
			for (var i = 2, col; col = row.cells[i]; i++) {
				col.innerHTML +=("<br><td><img src='images/"+col.innerText+".png' class='flag'</td>"); //"${rowNumber[rowCell]}"
			}
	}
	
	//Build Table
	function buildTable() {
		getCSV.call(this).then(function(response){
			var allRows = response.split(/\r?\n|\r/).filter(isNotEmpty);
			var categoryData = [];
			var unique = []; //Unique category items
					
		  
			var table = '<table class="table table-striped table-bordered" id="myTable">';
	        for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
	            if (singleRow === 0) {
	                table += '<thead>';
	                table += '<tr>';
	            } else {
	                table += '<tr>';
	            }
			
	            var rowNumber = allRows[singleRow].split(';');
	            for(var rowCell = 0; rowCell < rowNumber.length; rowCell++){

					if(singleRow === 0){ //First row of the table 
	                    table += `<th style= 'text-align:center' class="c${rowNumber[rowCell]} fixed-height"</th>`; 
	                    table += rowNumber[rowCell];
	                    table += '</th>';
						if (rowCell > 1){ //Populate drop down company select	
							$("#company-selectpicker").append(`<option value="${rowNumber[rowCell]}">${rowNumber[rowCell]}</option>`); //selected=""
						}
					}


	                else {
	                    table += `<td class="c${rowNumber[rowCell]} align-middle">`;////class="${rowNumber[rowCell]}";
						if(rowNumber[rowCell] === '0'){
							table += "<div class='text-center'><i class='bi bi-circle-fill yellowicon'></i></div>";
						}
						else if(rowNumber[rowCell] === '1'){
							table += "<div class='text-center'><i class='bi bi-circle-fill greenicon'></i></div>";
						}
						else if(rowNumber[rowCell] === '-1'){
							table += "<div class='text-center'><i class='bi bi-circle-fill redicon'></i></div>";
						}
						else if(rowNumber[rowCell] === '-5'){
							table += "<div class='text-center'><i class='bi bi-circle-fill blackicon'></i></div>";
						}
						else {table += rowNumber[rowCell];}
						table += '</td>';	
					}
					
					if (singleRow > 0 && rowCell === 0){
						categoryData.push(rowNumber[rowCell]);								
					};

				}
	            if (singleRow === 0) {
	                table += '</tr>';
	                table += '</thead>';
	                table += '<tbody>';
	            } else {
	                table += '</tr>';
	            }
	        }

			//Populate category dropdown
			unique = categoryData.filter(function(item, i, arr) {
				return i == arr.indexOf(item);
			});
			
			unique.pop() //Remove the company element from the array
			
			//update global variable
			noFeatures = unique.length;

			var yourSelect = $('#feature-selectpicker');
			for (i = 0; i < unique.length; i += 1) {
				yourSelect.append('<option value="'+'p'+unique[i]+'">'+unique[i]+'</option>'); // selected=""
			}

			$("#feature-selectpicker").selectpicker("refresh");

			//Closing tags
	        table += '</tbody>';
	        table += '</table>';
			$("#company-selectpicker").selectpicker("refresh");

			document.getElementById("generator-table").innerHTML = table;

			//hide table elements at start
			tableView();

			//Add company names
			addCompanyNames();

			//Flag images
			addFlags();

		}, function(error){
			console.error(error);
		});
};
}());


//////////////////////////////////* Events *///////////////////////////////////


//Loading screen
$(window).on('load', function () {
	$('#loading').hide();
});


var old_array =[];
//Filter table columns by company group from checkbox
$('input:checkbox').on('change', function(e) {
	
	var allSelected = $('input[name^="chk"]').length;
	var numberSelected = $('input[name^="chk"]:checked').length; // How many checkboxes are checked
	var ischecked = e.target.checked;

	var arr = []; //the menu item
	var yourArray = [];
	var new_array = [];

	$('input[name^="chk"]:checked').each(function(){
		yourArray.push($(this).val());
	});

	if (numberSelected === 0) {
		$('#company-selectpicker').selectpicker('deselectAll');
		$('#company-selectpicker').selectpicker('refresh');;
		tableView();
	}

	else {
		for (var i = 0; i < yourArray.length; i++){
			var last = '.c'+yourArray[i];

			
			$(last).each(function () {
				var col = $(this).index()+1;
				new_array.push(col);
				arr.push(($('tr th:nth-child('+col+')').html().slice(0,4))); 
				
				//var diff = $(old_array).not(new_array).get();
				if (ischecked === true) {
				 	$('th:nth-child('+col+'), tr td:nth-child('+col+')').show()
				}
			});
		}
		//Compare 2 Arrays
		var diff = $(old_array).not(new_array).get();
		if (!ischecked){
			for(i=0; i<diff.length; i++){
				$('th:nth-child('+diff[i]+'), tr td:nth-child('+diff[i]+')').hide()
			};	
		}

		old_array = new_array;
		
		for (var i=0; i<arr.length; i++){
			$('#company-selectpicker').selectpicker('val', arr);
		};	
		$('th:nth-child(2), tr td:nth-child(2)').show();
	}
});

//Filter table columns by company select
$('#company-selectpicker').on('changed.bs.select', function (e, clickedIndex, isSelected, newValue, oldValue)  {

	var selected = $('#company-selectpicker').selectpicker().val().length; //number of elements selected	
	var total = $('#company-selectpicker').find('option').length/2; //Number of elements in dropdown
	var numberCols = document.getElementById("myTable").rows[0].cells.length;

	//Deselect ALL or nothing selected
	if (selected === 0) {	
		for (var i = 3; i < numberCols+1; i++) {
			$('table th:nth-child('+i+'), table td:nth-child('+i+')').hide();
		}
		$(".group-select").prop( "checked", false );
	}
	
	//Select ALL
	else if (selected === total){
		$(".group-select").prop( "checked", true );
		for (var i = 3; i < numberCols+1; i++) {
			$('table th:nth-child('+i+'), table td:nth-child('+i+')').show();
		}
	}
	//With company group checkbox select
	else if (clickedIndex === null && isSelected === null) {
	}

	//Enable company selection
	else {

		//Toggle view based on selection
		$('tr td:nth-child('+(clickedIndex+3)+')').toggle();  
		$('tr th:nth-child('+(clickedIndex+3)+')').toggle();
	}
});

//Filter table rows by feature select
$('#feature-selectpicker').on('changed.bs.select', function (e, clickedIndex, isSelected, newValue, previousValue) {		
		
	var selected = $('#feature-selectpicker').selectpicker().val().length; //number of elements selected	
	//Deselect ALL
	if (selected === 0) {
		$('tbody tr').hide();
			
	}
	//Select ALL
	else if (selected === noFeatures){
		$('tbody tr').show();
		stripe();
	}
	else {
		
		//Enable company selection
		var last = ".c"+e.target.options[clickedIndex].text.replace(/ /g, ".");
						
		//Toggle view based on selection
		$(last).parent().toggle();
		stripe();
	}
});

//Reset button
$('#button-reset').on( "click", function() { 
	console.log("reset");
});


//////////////////////////////////* Displays *///////////////////////////////////


//Initial view of table on load
function tableView () {

	//$(trow[trow.length-3]).hide();
	$('tr th').hide();
	$('tr td').hide();
	
	// selects both table header and table data cells from the first and second column of the table
	$('table th:nth-child(1), table td:nth-child(1)').show();
	$('table th:nth-child(2), table td:nth-child(2)').show();
	$('#feature-selectpicker').selectpicker('selectAll');
	
	//Set fixed width for Category and Description
	$('table th:nth-child(2), table td:nth-child(2)').addClass('fixed');
	
	//hide bottom rows
	// var trow = $('#myTable tr');
	// $('tr:last').hide(); 
	// $(trow[trow.length-2]).hide();
	//$(trow[trow.length-3]).hide();
};

//Restripe table after filter use
function stripe () {
	$("tr:visible").each(function (index) {
		$(this).css("background-color", !!(index & 1)? "rgba(0,0,0,.05)" : "rgba(0,0,0,0)");
	});
};

//////////////////////////////////* End *///////////////////////////////////