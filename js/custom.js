//////////////////////////////////* Global Variables *///////////////////////////////////


//Global variables
var noFeatures = 0; //Unique number of features in table
var startingCol = 2; //Category column and feature column in array
var jCol = startingCol +1; //Starting column in JQuery
var erpFilterUsed = false; //Checks to see if the ERP filter has been used

//////////////////////////////////* Functions *///////////////////////////////////


//Create table function
(function(){

	// Constructor method
	this.csvTable = function(){
		this.csvFile = null;

		// Create options by extending defaults with the passed in arugments
    	if (arguments[0] && typeof arguments[0] === "object") {
      		this.options = arguments[0];
    	}

	}

	csvTable.prototype.run = function() {
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
			for (var i = startingCol, col; col = row.cells[i]; i++){
				$('#company-selectpicker option:nth-child('+(i-1)+')').append('<option class="companyName"> | '+row.cells[i].innerText+'</option>'); //var select = '#bs-select-1-'+(i-2);
			}
		$("#company-selectpicker").selectpicker("refresh");
	};

	//Add flags
	function addFlags() {
		var table = document.getElementById('myTable');
		var row = table.rows[0];
			for (var i = startingCol, col; col = row.cells[i]; i++) {
				try {
					col.innerHTML +=("<br><td><img src='images/"+col.innerText+".png' class='flag'</td>"); //"${rowNumber[rowCell]}"
				} catch (error) {
					console.log("no flag image " + col.innerText);
				}
			}
	}
	
	//Build Table
	function buildTable() {
		getCSV.call(this).then(function(response){
			var allRows = response.split(/\r?\n|\r/).filter(isNotEmpty);
			var categoryData = [];
			var erpSystems = [];
				  
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
					}
					//Add erp system names to array
					else if (singleRow === allRows.length-3 && rowCell > 1){
						erpSystems.push(rowNumber[rowCell]);
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

		//Populate category dropdown/////////////////////////////////////////////////////////////
			var unique = categoryData.filter(function(item, i, arr) {
				return i == arr.indexOf(item);
			});
			
			unique.pop() //Remove the company element from the array
			
			//update global variable
			noFeatures = unique.length;

			var featureSelect = $('#feature-selectpicker');
			for (i = 0; i < unique.length; i += 1) {
				featureSelect.append('<option value="'+'p'+unique[i]+'">'+unique[i]+'</option>'); // selected=""
			}

			$("#feature-selectpicker").selectpicker("refresh");

		//Populate ERP dropdown/////////////////////////////////////////////////
			var uniqueErp = erpSystems.filter(function(item, i, arr) {
				return i == arr.indexOf(item);
			});
			

			var erpSelect = $('#erp-selectpicker');
			erpSelect.append('<option data-hidden="true" value="no-erp" default>No ERP Selected</option>');
		
			for (i = 0; i < uniqueErp.length; i += 1) {
				erpSelect.append('<option value="'+uniqueErp[i]+'">'+uniqueErp[i]+'</option>'); // selected=""
			}


			$("#erp-selectpicker").selectpicker("refresh");	
			
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
		$('#company-selectpicker').selectpicker('refresh');
		tableView();
	}

	//All checkboxes selected
	else if ($('input[name^="chk"]').length == numberSelected) {
		$('#company-selectpicker').selectpicker('selectAll');
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
	resetErpFilter();
});

//Filter table columns by company select
$('#company-selectpicker').on('changed.bs.select', function (e, clickedIndex, isSelected, newValue, oldValue)  {

	var selected = $('#company-selectpicker').selectpicker().val().length; //number of elements selected	
	var total = $('#company-selectpicker').find('option').length/2; //Number of elements in dropdown because we of the add companies script we have to divide by 2
	var numberCols = document.getElementById("myTable").rows[0].cells.length;

	//Deselect ALL or nothing selected
	if (selected === 0) {	
		for (var i = jCol; i < numberCols+1; i++) {
			$('table th:nth-child('+i+'), table td:nth-child('+i+')').hide();
		}
		$(".group-select").prop("checked", false);
	}
	
	//Select ALL
	else if (selected === total){
		$(".group-select").prop("checked", true);
		for (var i = jCol; i < numberCols+1; i++) {
			$('table th:nth-child('+i+'), table td:nth-child('+i+')').show();
		}
	}
	//With company group checkbox select
	else if (clickedIndex === null && isSelected === null) {
	}

	//Enable company selection
	else {

		//Toggle view based on selection
		$('tr td:nth-child('+(clickedIndex+jCol)+')').toggle();  
		$('tr th:nth-child('+(clickedIndex+jCol)+')').toggle();
	}

	if (erpFilterUsed === true) {
		resetErpFilter ();
		erpFilterUsed == false;
	};

});

//Filter table rows by feature select
$('#feature-selectpicker').on('changed.bs.select', function (e, clickedIndex) {		
		
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

//Filter table colums by ERP select
$('#erp-selectpicker').on('changed.bs.select', function (e) {		
	erpFilterUsed = false;

	$(".group-select").prop("checked", false);
	tableView();
	var last = '.c'+e.target.value;
	var arr = [];

	//Set dropdowns
	$('#company-selectpicker').selectpicker('deselectAll');
	$('input:checkbox').removeAttr('checked');

	$(last).each(function () {
		var col = $(this).index()+1;
		arr.push(($('tr th:nth-child('+col+')').html().slice(0,4))); 
		$('th:nth-child('+col+'), tr td:nth-child('+col+')').show(); 
	});

	for (var i=0; i<arr.length; i++){
		$('#company-selectpicker').selectpicker('val', arr);
	};	
	$('th:nth-child(2), tr td:nth-child(2)').show();

	erpFilterUsed = true;
});


//Reset button
$('#button-reset').on( "click", function() { 
	tableView();
	$(".group-select").prop("checked", false);
	$('#company-selectpicker').selectpicker('deselectAll');
	$('#erp-selectpicker').selectpicker('deselectAll');
	$('.selectpicker').selectpicker('refresh');
});


//Scroll to top button
$(document).ready(function($){
    $(window).scroll(function(){
        if ($(this).scrollTop() > 50) {
            $('#backToTop').fadeIn('slow');
        } else {
            $('#backToTop').fadeOut('slow');
        }
    });
    $('#backToTop').click(function(){
        $("html, body").animate({ scrollTop: 0 }, 500);
        return false;
    });
});

//////////////////////////////////* Displays *///////////////////////////////////


//Initial view of table on load
function tableView () {

	//Set column 1 width
	//$('table tr td').eq(0).css('width','150px');

	//Hide everything
	$('tr th').hide();
	$('tr td').hide();
	
	// selects both table header and table data cells from the first and second column of the table
	$('table th:nth-child(1), table td:nth-child(1)').show();
	$('table th:nth-child(2), table td:nth-child(2)').show();
	
	//Check and uncheck select pickers
	$('#feature-selectpicker').selectpicker('selectAll');
	
	//Set fixed width for Category and Description
	$('table th:nth-child(2), table td:nth-child(2)').addClass('fixed');
	
	//hide bottom rows
	var trow = $('#myTable tr');
	$('tr:last').hide(); 
	$(trow[trow.length-2]).hide();
	$(trow[trow.length-3]).hide();
};

//Restripe table after filter use
function stripe () {
	$("tr:visible").each(function (index) {
		$(this).css("background-color", !!(index & 1)? "rgba(236,236,236,0.6)" : "rgba(236,236,236,0)");
	});
};

//Reset the erp filter
function resetErpFilter () {
	$("#erp-selectpicker").val('no-erp');
	$("#erp-selectpicker").selectpicker('refresh');
};

//////////////////////////////////* End *///////////////////////////////////
