/*
*                   Izračunljivost 2020
*                                           © FV
*/

$(document).ready(function()
{

    $( 'form[name="mjesnost"]').on( 'submit', obradi_inputn );
    $( 'form[name="program"]').on( 'submit', obradi_calculate )
                            .on( 'change', update_numbers );
    $( 'button[name="toggleLog"]').on( 'click', function(){
        $( 'div[name="log"]' ).toggle();
    } );

 
    //$('form[name="program"]').addEventListener('change', function() {
    //    alert('Hi!');
    //});

});

function obradi_inputn()
{
    event.preventDefault();

    var formProgram = $( 'form[name="program"]');
    var nPrev = formProgram.attr("n");

    $( 'p[name="unesiPrimjer"]').show();

    formProgram.show()
                .attr("n", $('input[name="inputRn"]').val());

    $( 'div[name="testInput"]').html('');
    for( var i = 1; i <= $('input[name="inputRn"]').val(); i+=1)
        $( 'div[name="testInput"]').append( 
            $('<input>').attr('type', 'number')
                        .attr('name', 'x'+i)
                        .attr('min', '0')
                        .attr('step', '1')
                        .attr('value', '0')
                        .attr('required', 'true')
         );

    // ažuriraj tablicu prvo
    //    form.update() -- implementirat

    // dodaj red 
    //var lineTemplate = $( 'div[lineNumber="-1"]');
    //var newLine = lineTemplate.clone();
   // newLine.prop("lineNumber", "1");
   if( !(typeof nPrev !== typeof undefined && nPrev !== false) )    //  ako je prvi put
        addLine(0);
    update_numbers();

}

function update_numbers(){
    /*
    var nReg = parseInt( $( 'form[name="program"]').attr("n"));
    var nIns = parseInt( $( 'div[name="line"]' ).length ) -1;

    $( 'div[name="line"]' ).each( function(){

        if( $(this).find('select[name="target"]').length > 0 )
            $(this).find('select[name="target"]').children('option').each(function(){
                if( $(this).html().includes("R") && parseInt($(this).attr('value')) > nReg )
                {
                    if( $(this).is(':selected') )
                        $(this).parent().val('-1').change();
                    $(this).remove();
                }
                else if( parseInt($(this).attr('value')) > nIns )
                    $(this).remove();
            });

        // drugi sl


        console.log( $(this).find('select[name="target"]').children('option') , nIns);
    });*/
}


// dodaj red i
function addLine(i)
{
    // dodaj red 
    var lineTemplate = $( 'div[linenumber="-1"]');
    var newLine = lineTemplate.clone();
    newLine.show();
   
        // uredi brojeve
    newLine.attr('linenumber', i);
        //postavi i ispisu broj
    newLine.children( 'span[name="lineNumber"]' ).html(i);
    
    // dodaj pretplate
    newLine.children( 'button[name="newLine"]').on('click', actionAddRow );
    newLine.children( 'button[name="removeLine"]').on('click', actionRemoveRow );
    newLine.children( 'select[name="instruction"]').attr('required', 'true')
                                                    .on('change', changeIns );

    // ako dodajemo prije prvog ---     IMPLEMENTIRAT   
    //  if(...)

    $( 'div[linenumber="'+(i-1)+'"]' ).after(newLine);

    // pomakni indexse
    var j = 0;
    $( 'div[name="line"]' ).each(function(){
        if( parseInt($(this).attr("linenumber"))  > i )
        {
            $(this).attr("linenumber", parseInt($(this).attr("linenumber"))+1);
            $(this).children( 'span[name="lineNumber"]' ).html(parseInt($(this).attr("linenumber")));
        }
        if( parseInt($(this).attr("linenumber"))  === i )
        {
            if( j === 1)
            {
                $(this).attr("linenumber", parseInt($(this).attr("linenumber"))+1);
                $(this).children( 'span[name="lineNumber"]' ).html(parseInt($(this).attr("linenumber")));
            }
            j+=1;
        }
    });

}

function actionAddRow(e){
    e.preventDefault();
    var target = $(e.target);

    addLine( parseInt(target.parent().attr('linenumber'))+1);
}

function actionRemoveRow(e){
    e.preventDefault();
    var target = $(e.target);
    var i = target.parent().attr('linenumber');

    target.parent().remove();
    $( 'div[name="line"]' ).each(function(){
        if( parseInt($(this).attr("linenumber"))  > i )
        {
            $(this).attr("linenumber", parseInt($(this).attr("linenumber"))-1);
            $(this).children( 'span[name="lineNumber"]' ).html(parseInt($(this).attr("linenumber")));
        }
    });
}

function changeIns(evenet){
    var target = $(evenet.target);
    var div = $( '<span>' );
    var option = $( '<option>');
    var selectTarget = $( '<select>').attr('name', 'target');
    var selectDest = $( '<select>').attr('name', 'destination');

    var m = $( 'div[name="line"]').length - 1;

    var n = parseInt($( 'form[name="program"]').attr("n"));
    
    //makni prijašnje registre
    target.siblings( 'span[name="registers"]' ).remove();
    console.log(target.siblings( 'div[name="rgisters"]' ));
    div.attr('name', 'registers' );
    

    if( this.value === "inc"){
        for( var i = 0; i <= n; i+=1 )
            selectTarget.append( $( '<option>' ).attr('value', i).html("R<sub>"+i+"</sub>"));
        selectTarget.append( $( '<option>' ).attr('value', '-1').html("--").attr('disabled', 'true'));
        div.append(selectTarget);
    }
    else if( this.value === "dec"){
        for( var i = 0; i <= n; i+=1 )
            selectTarget.append( $( '<option>' ).attr('value', i).html("R<sub>"+i+"</sub>"));
        for( var i = 0; i <= m; i+=1 )
            selectDest.append( $( '<option>' ).attr('value', i).html("<sub>"+i+"</sub>"));

        selectTarget.append( $( '<option>' ).attr('value', '-1').html("--").attr('disabled', 'true'));
        selectDest.append( $( '<option>' ).attr('value', '-1').html("--").attr('disabled', 'true'));

        div.append(selectTarget)
            .append(selectDest);
    }
    else if( this.value === "goto"){
        for( var i = 0; i <= m; i+=1 )
            selectTarget.append( $( '<option>' ).attr('value', i).html("<sub>"+i+"</sub>"));

        selectDest.append( $( '<option>' ).attr('value', '-1').html("--").attr('disabled', 'true'));
        div.append(selectTarget);
    }

    target.after(div);


    console.log( $( 'form[name="program"]').attr("n") );
}


function obradi_calculate(event)
{
    event.preventDefault();
    var R = new Array(parseInt($( 'form[name="program"]').attr("n"))+1).fill(0);
    var i;
    var input = $( 'form[name="program"]').serializeArray();
    var prg = [];

    for( i = 0;  input[i].name === "x"+(i+1) ; ++i)
        R[i+1] = parseInt(input[i].value);
    
    for( i-=  1; i < input.length; ++i )
    {
        if( input[i].value === "dec")
        {
            prg.push( {instruction: input[i].value, target: parseInt(input[i+1].value),
                            destination:  parseInt(input[i+2].value)});
            i+=2;
        }
        else if( input[i].value === "inc")
        {
            prg.push( {instruction: input[i].value, target: parseInt(input[i+1].value)});
            i+=1;
        }
        else if( input[i].value === "goto")
        {
            prg.push( {instruction: input[i].value, target: parseInt(input[i+1].value)});
            i+=1;
        }
    }
    var startTime, endTime, timeout= false;
    var ispis = {currentIns: 1, nextIns: 1};
    var log = $( 'div[name="log"]' );
    log.html('')
        .append( $('<p>').html('Log:') );
    startTime = new Date();
    i=0;
    while( i < prg.length && timeout == false )
    {
        endTime = new Date();
        if( Math.round((endTime - startTime)/ 1000) >3)
        {
            timeout = true;
            break;
        }
        ispis.currentIns = i;
        if( prg[i].instruction === "dec" )
        {
            if( R[prg[i].target] - 1 < 0 )
                i = parseInt( prg[i].destination);
            else{
                R[prg[i].target] -= 1;
                i += 1;
            }
        }
        else if( prg[i].instruction === "inc" )
        {
            R[prg[i].target] += 1;
            i += 1;
        }
        else if( prg[i].instruction === "goto" )
        {
            i = parseInt(prg[i].target);
        }
        ispis.nextIns = i;

        log.append( $('<p>').html(ispis.currentIns+". -> "+ ispis.nextIns +".   R_*:"+R.toString()) );

        
    }
    endTime = new Date();
if(timeout)
    $( 'div[name="simulation"]' ).html("Timeout!");
else
    $( 'div[name="simulation"]' ).html("Rješenje: " + R[0]);

    console.log(input);
    console.log(R);
    console.log(prg);
    console.log(prg.length);
    

}

