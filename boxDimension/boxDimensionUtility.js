"use strict";
//runs this whenever the page is reloaded, especially for search. It does the same thing as changeSearchSelect()
$(function(){
  $('#cover').hide();
  $('#import').click(function(){
    $('#cover').show();
  });
});
