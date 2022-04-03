//////////////////////////////////* Select Picker Methods *//////////////////////////////////
$('#feature-selectpicker').on('changed.bs.select', function (e, clickedIndex, isSelected, newValue, previousValue) {	
$('#feature-selectpicker').selectpicker().val().length; //returns number of elements selected
$('#feature-selectpicker').val() - returns array of elements selected
$('#company-selectpicker').find('option:selected').length
$('#feature-selectpicker').text() - returns text value of all elemenents in array
$('#feature-selectpicker').selectpicker('selectAll');
$('#company-selectpicker').prop('disabled', false);
$('#company-selectpicker').selectpicker('refresh');
e.target.value
var selected_value = e.options[e.selectedIndex].value;
'#company-selectpicker').find('option:selected').length>1)

$('.selectpicker').selectpicker('val', [1401,1233,3108]); 
$('#company-selectpicker').selectpicker.append('val', 3107);

// Initialize the select picker.
$('select[name=selValue]').selectpicker();

// Extract the value of the first option.
var sVal = $('select[name=selValue] option:first').val();
var bar= $(#foo).find("option:selected").val();

// Set the "selected" value of the <select>.
$('select[name=selValue]').val(sVal);



//////////////////////////////////* Page Refresh *///////////////////////////////////


const pageAccessedByReload = (
	(window.performance.navigation && window.performance.navigation.type === 1) ||
	  window.performance
		.getEntriesByType('navigation')
		.map((nav) => nav.type)
		.includes('reload')
  );
  
  if(pageAccessedByReload){

  };

  

/* Popover how to activate feature

https://jsfiddle.net/9P64a/


*/

					
//Add popover text
if (rowCell === 1 && singleRow>0) {
	//$("tr td:nth-child(2)" ).append(`<a id="popoverData" class="btn" href="#" data-content="Popover with data-trigger" rel="popover" data-placement="bottom" data-original-title="Title" data-trigger="hover">Popover with data-trigger</a>`);
	//console.log($(this).closest('td').prev());//.append(`<a id="popoverData" class="btn" href="#" data-content="Popover with data-trigger" rel="popover" data-placement="bottom" data-original-title="Title" data-trigger="hover">Popover with data-trigger</a>`);
}