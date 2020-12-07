/*
*                   Izračunljivost 2020
*                                           © FV
*/

$(document).ready(function () {

    $('form[name="mjesnost"]').on('submit', obradi_inputn);
    $('form[name="program"]').on('submit', obradi_calculate)
        .on('change', update_numbers);
    $('button[name="toggleLog"]').on('click', function () {
        $('table[name="log"]').toggle();
    });
    $('button[name="addMakro"]').on('click', addNewMakro);

});

function obradi_inputn() {
    event.preventDefault();

    var formProgram = $('form[name="program"]');
    var nPrev = formProgram.attr("n");

    $('p[name="unesiPrimjer"]').show();

    formProgram.show()
        .attr("n", $('input[name="inputRn"]').val());

    $('div[name="testInput"]').html('');
    for (var i = 1; i <= $('input[name="inputRn"]').val(); i += 1)
    {
        var d1=    $( '<div>').attr( 'class',"form-group row");
        var l= $( '<label>').attr('for', 'x'+i).attr('class','col-sm-2 col-form-label').attr('id', 'x'+i).html("\\(R_"+i+"\\):");
        var d2=    $( '<div>').attr( 'class',"col-sm-10");
        var input =    $( '<input>').attr( 'type',"number").attr('name', 'x' + i)
                                    .attr('min', '0')
                                    .attr('step', '1')
                                    .attr('value', '0')
                                    .attr('required', 'true')
                                    .attr('class', 'form-control');
        $('div[name="testInput"]').append(d1.append( l).append(d2.append(input)));
        MathJax.typeset(["#x"+i]);
                /*$('div[name="testInput"]').append(
            $('<input>').attr('type', 'number')
                .attr('name', 'x' + i)
                .attr('min', '0')
                .attr('step', '1')
                .attr('value', '0')
                .attr('required', 'true')
                .attr('class', 'form-control')
        );*/
    }
        
    if (!(typeof nPrev !== typeof undefined && nPrev !== false))    //  ako je prvi put
    {
        addLine(0,"program");
        // za makro
        $('div[name="makros"]').attr("totalMakros", "0");
    }
    update_numbers();

}

function addNewMakro(){
    event.preventDefault();

    var divMakros = $('div[name="makros"]');
    var formMakro = $('<form>').attr('name', 'makro '+parseInt(divMakros.attr('totalMakros')) );

    var lineTemplate = $('form[name="program"]').children('div[linenumber="-1"]').clone();

    // unos naslova
    var span = $('<span>');
    span.attr('class', 'badge badge-danger').html('Erase Makro').on('click', removeMakro);
    formMakro.append( $('<p>').html('Unesi MAKRO '+ parseInt(divMakros.attr('totalMakros') )+' :').append( span)).append(lineTemplate);

    divMakros.append(formMakro);
    divMakros.attr("totalMakros", parseInt(divMakros.attr("totalMakros"))+1);
    addLine(0,'makro '+(parseInt(divMakros.attr('totalMakros')) -1));

    var makroNumber = parseInt(divMakros.attr('totalMakros'));
    update_numbers();

    // dodat makro u instrukcije
    $('div[name="line"]').each( function(){
        if( parseInt($(this).attr('linenumber')) != -1 )
        {
            var makroCurrent = -1;
            if( $(this).parents('form').attr('name').split(' ')[0] == 'makro' )
                makroCurrent = parseInt($(this).parents('form').attr('name').split(' ')[1] );
            for(var j = 0; j < makroNumber; ++j)
                if( $(this).find('select[name="instruction"] option[value="makro '+j+'"]').length == 0 && j != makroCurrent )
                    $(this).find('select[name="instruction"]').append( $('<option>').attr('value', 'makro ' + (j)).html("Makro " + (j) ));
        }
    });
}

function removeMakro(event)
{
    // var target = $(event.target);
    // var removeNumber = parseInt(target.parents( 'form').attr('name').split(' ')[1]);

    // target.parents( 'form').remove();
    
    // $('div[name="makros"]').children('form').each(function (){
    //     if(parseInt($(this).attr('name').split(' ')[1]) > removeNumber )
    //         $(this).children('p').html( )html('makro '+(parseInt($(this).attr('name').split(' ')[1]) - 1) )
    //         $(this)..attr('name', 'makro '+(parseInt($(this).attr('name').split(' ')[1]) - 1) );
    // });

    // $('div[name="line"]').each(function(){
    //     if( parseInt($(this).attr('linenumber')) != -1 )
    //     {   
    //         $(this).children('select[name="instruction"]').children(' option').each(function (){
    //             console.log('bok',$(this).attr('value') );
    //             if( $(this).attr('value').split(' ')[0] == 'makro')
    //             {   
    //                 if( parseInt($(this).attr('value').split(' ')[1]) == removeNumber )
    //                     $(this).remove();
    //                 if( parseInt($(this).attr('value').split(' ')[1]) > removeNumber )
    //                     $(this).attr('value', parseInt($(this).attr('value')) -1 );
    //             }
    //         });
    //     }
           
    // });
}



function makeUpdate()
{
    var nReg = parseInt($('form[name="program"]').attr("n"));
    var nIns = parseInt($(this).siblings('div[name="line"]').length) ;   //      za template - 1

 
        var selectTarget = $(this).find('select[name="target"]');
        var selectDestination = $(this).find('select[name="destination"]');

        if (selectTarget.length > 0) {
            for (var j = parseInt(selectTarget.children('option').length) - 2; j < nReg; ++j)
                selectTarget.children('option').last().before($('<option>').attr('value', j + 1).html("R<sub>" + (j + 1) + "</sub>"));

            selectTarget.children('option').each(function () {
                if (parseInt($(this).attr('value')) > nReg) {
                    if ($(this).is(':selected'))
                        $(this).parent().val('-1').change();
                    $(this).remove();
                }
            });
        }

        // drugi sl
        if (selectDestination.length > 0) {
            console.log(selectDestination.children('option').length);
            for (var j = parseInt(selectDestination.children('option').length) - 2; j < nIns; ++j)
                selectDestination.children('option').last().before($('<option>').attr('value', j + 1).html(j + 1));

            selectDestination.children('option').each(function () {
                if (parseInt($(this).attr('value')) > nIns) {
                    if ($(this).is(':selected'))
                        $(this).parent().val('-1').change();
                    $(this).remove();
                }
            });
        }

        //console.log($(this).parents('div[name="line"]'), nIns);

}

function update_numbers() {

    $('form[name="program"]').children('div[name="line"]').each(makeUpdate);
    $('div[name="makros"]').children('form').each(
       function(){  $(this).children('div[name="line"]').each(makeUpdate);}
    );

    //$('div[name="line"]').each(makeUpdate);
}


// dodaj red i
function addLine(i, formName) {
    // dodaj red 
    var lineTemplate = $('div[linenumber="-1"]').first();
    var newLine = lineTemplate.clone();
    newLine.show();

    // uredi brojeve
    newLine.attr('linenumber', i);
    //postavi i ispisu broj
    newLine.children('span[name="lineNumber"]').html(i);

    // dodaj pretplate
    newLine.find('button[name="newLine"]').on('click', actionAddRow);
    newLine.find('button[name="removeLine"]').on('click', actionRemoveRow);
    newLine.children('select[name="instruction"]').attr('required', 'true')
        .on('change', changeIns);

    // ako dodajemo prije prvog ---     IMPLEMENTIRAT   
    //  if(...)
    console.log($( 'form[name="'+formName+'"]').find('div[linenumber="' + (i - 1) + '"]'));

    $( 'form[name="'+formName+'"]').find('div[linenumber="' + (i - 1) + '"]').after(newLine);

    // pomakni indexse
    var j = 0;
    $( 'form[name="'+formName+'"]').find('div[name="line"]').each(function () {
        if (parseInt($(this).attr("linenumber")) > i) {
            $(this).attr("linenumber", parseInt($(this).attr("linenumber")) + 1);
            $(this).find('span[name="lineNumber"]').html(parseInt($(this).attr("linenumber")));
        }
        if (parseInt($(this).attr("linenumber")) === i) {
            if (j === 1) {
                $(this).attr("linenumber", parseInt($(this).attr("linenumber")) + 1);
                $(this).find('span[name="lineNumber"]').html(parseInt($(this).attr("linenumber")));
            }
            j += 1;
        }
    });

    // dodat makro u instrukcije
    $('div[name="line"]').each( function(){
        if( parseInt($(this).attr('linenumber')) != -1 )
        {
            var makroCurrent = -1;
            if( $(this).parents('form').attr('name').split(' ')[0] == 'makro' )
                makroCurrent = parseInt($(this).parents('form').attr('name').split(' ')[1] );
            for(var j = 0; j < parseInt($('div[name="makros"]').attr('totalMakros')); ++j)
                if( $(this).find('select[name="instruction"] option[value="makro '+j+'"]').length == 0 && j != makroCurrent )
                    $(this).find('select[name="instruction"]').append( $('<option>').attr('value', 'makro ' + (j)).html("Makro " + (j) ));
        }
    });
}

function actionAddRow(e) {
    e.preventDefault();
    var target = $(e.target);

    console.log(target.parents('form').attr('name'));
    addLine(parseInt(target.parents('div[name="line"]').attr('linenumber')) + 1, target.parents('form').attr('name'));
    update_numbers();
    console.log(target.parents('div[name="line"]').attr('linenumber'));

}

function actionRemoveRow(e) {
    e.preventDefault();
    var target = $(e.target);
    var i = target.parents('div[name="line"]').attr('linenumber');
    var templateLine = target.parents('div[name="line"]').siblings('div[lineNumber="-1"]');

    target.parents('div[linenumber="'+i+'"]').remove();
    templateLine.siblings().each(function () {
        if (parseInt($(this).attr("linenumber")) > i) {
            $(this).attr("linenumber", parseInt($(this).attr("linenumber")) - 1);
            $(this).children('span[name="lineNumber"]').html(parseInt($(this).attr("linenumber")));
        }
    });
    update_numbers();
}

function changeIns(evenet) {
    var target = $(evenet.target);
    var div = $('<span>');
    var option = $('<option>');
    var selectTarget = $('<select>').attr('name', 'target').attr('required', 'true').attr('class', 'custom-select col-md-3');
    var selectDest = $('<select>').attr('name', 'destination').attr('required', 'true').attr('class', 'custom-select col-md-2');

    var m = target.parents('div[name="line"]').siblings('div[name="line"]').length  ;

    var n = parseInt($('form[name="program"]').attr("n"));

    //makni prijašnje registre
    target.siblings('span[name="registers"]').remove();
    console.log(target.siblings('span[name="rgisters"]'));
    div.attr('name', 'registers');


    if (this.value === "inc") {
        for (var i = 0; i <= n; i += 1)
            selectTarget.append($('<option>').attr('value', i).html("R<sub>" + i + "</sub>"));
        selectTarget.append($('<option>').attr('value', '-1').html("--").attr('disabled', 'true'));
        div.append(selectTarget);
    }
    else if (this.value === "dec") {
        for (var i = 0; i <= n; i += 1)
            selectTarget.append($('<option>').attr('value', i).html("R<sub>" + i + "</sub>"));
        for (var i = 0; i <= m; i += 1)
            selectDest.append($('<option>').attr('value', i).html("<sub>" + i + "</sub>"));

        selectTarget.append($('<option>').attr('value', '-1').html("--").attr('disabled', 'true'));
        selectDest.append($('<option>').attr('value', '-1').html("--").attr('disabled', 'true'));

        div.append(selectTarget)
            .append(selectDest);
    }
    else if (this.value === "goto") {//////////////////////problem
        for (var i = 0; i <= m; i += 1){
            selectDest.append($('<option>').attr('value', i).html("<sub>" + i + "</sub>"));
        console.log(i);}

        selectDest.append($('<option>').attr('value', '-1').html("--").attr('disabled', 'true'));
        console.log('boooook', selectDest);

        div.append(selectDest);
    }

    target.after(div);
    console.log(target.parents('div[name="line"]'),m);

    console.log($('form[name="program"]').attr("n"));
}

function spljosti(duljina, makroName){
    var input = $('form[name="'+makroName+'"]').serializeArray();
    var prg = [];

    for (i = 0 ; i < input.length; ++i) {
        console.log(input[i].value);
        if (input[i].value === "dec") {
            prg.push({
                instruction: input[i].value, target: parseInt(input[i + 1].value),
                destination: parseInt(input[i + 2].value) + duljina
            });
            i += 2;
        }
        else if (input[i].value === "inc") {
            prg.push({ instruction: input[i].value, target: parseInt(input[i + 1].value)  });
            i += 1;
        }
        else if (input[i].value === "goto") {
            prg.push({ instruction: input[i].value, target: parseInt(input[i + 1].value) + duljina });
            i += 1;
        }
        else if (input[i].value.split(' ')[0] === "makro") {
            Array.prototype.push.apply(prg, spljosti(prg.length  + duljina , input[i].value) );
            i += 1;
        }
    }
    return prg;
}

function obradi_calculate(event) {
    event.preventDefault();
    var R = new Array(parseInt($('form[name="program"]').attr("n")) + 1).fill(0);
    var i;
    var input = $('form[name="program"]').serializeArray();
    var prg = [];
    var timeoutTime = parseInt($( 'input[name="timeout"]').value);
    $('button').attr('disabled', 'true');

    for (i = 0; input[i].name === "x" + (i + 1); ++i)
        R[i + 1] = parseInt(input[i].value);

    for ( /*i = (i === 0) ? 0 : (i - 1)*/; i < input.length; ++i) {
        console.log(input[i]);
        if (input[i].value === "dec") {
            prg.push({
                instruction: input[i].value, target: parseInt(input[i + 1].value),
                destination: parseInt(input[i + 2].value)
            });
            i += 2;
        }
        else if (input[i].value === "inc") {
            prg.push({ instruction: input[i].value, target: parseInt(input[i + 1].value) });
            i += 1;
        }
        else if (input[i].value === "goto") {
            prg.push({ instruction: input[i].value, target: parseInt(input[i + 1].value) });
            i += 1;
        }
        else if (input[i].value.split(' ')[0] === "makro") {
            Array.prototype.push.apply(prg, spljosti(prg.length, input[i].value));
        }
    }

console.log("input=",input);console.log("prg=",prg);
    //print spljostenje
    var spljosteno = $( 'div[name="spljosteno"]').html('');
    var s='';
    for( var j = 0; j < prg.length;j+=1)
    {   
        s= (j + '. ') + prg[j].instruction; console.log(s,prg[j].instruction);
        if (prg[j].instruction === "dec") 
            s+= prg[j].target + ', ' + prg[j].destination;
        else if (prg[j].instruction === "inc" || prg[j].instruction === "goto") 
            s += prg[j].target;
        spljosteno.append( $('<p>').html(s));
    }

    var startTime, endTime, timeout = false;
    var ispis = { currentIns: 1, nextIns: 1 };

    //      ispis Log
    $('button[name="toggleLog"]').removeAttr('disabled');

    var log = $('table[name="log"]');
    var thead = $('<thead>').append($('<th>').html('Instruction'));

    for (var k = 0; k < parseInt($('form[name="program"]').attr("n")) + 1; ++k)
        thead.append($('<th>').html("R" + k));
    log.html('')
        .append(thead);

    var tbody = $('<tbody>');


    ///////////////////////

    startTime = new Date();
    i = 0;
    while (i < prg.length && timeout == false) {
        endTime = new Date();
        if (Math.round((endTime - startTime) / 1000) > timeoutTime) {
            timeout = true;
            break;
        }
        ispis.currentIns = i;
        if (prg[i].instruction === "dec") {
            if (R[prg[i].target] - 1 < 0)
                i = parseInt(prg[i].destination);
            else {
                R[prg[i].target] -= 1;
                i += 1;
            }
        }
        else if (prg[i].instruction === "inc") {
            R[prg[i].target] += 1;
            i += 1;
        }
        else if (prg[i].instruction === "goto") {
            i = parseInt(prg[i].target);
        }
        /// ispis log
        ispis.nextIns = i;
        var tr = $('<tr>');

        tr.append($('<td>').html(ispis.currentIns));
        for (var l = 0; l < R.length; ++l)
            tr.append($('<td>').html(R[l]));

        tbody.append(tr);
    }

    

    endTime = new Date();
    if (timeout)
        $('div[name="simulation"]').html("Timeout!");
    else
    {
        $('div[name="simulation"]').html("Rješenje: " + R[0]);
        log.append(tbody);
    }
    console.log(input);
    console.log(R);
    console.log(prg);
    console.log(prg.length);
    $('button').removeAttr('disabled');


}

