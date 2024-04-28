

$(document).ready(function() {
    var maxHeight = 0;
    $('.mcard').each(function() {
      var currentHeight = $(this).outerHeight();
      if (currentHeight > maxHeight) {
        maxHeight = currentHeight;
      }
    });
    $('.mcard').css('height', maxHeight);

    $('#commentModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var dataId = button.attr('data-id');
        $('#modalDataId').val(dataId);
        $('#commentList').empty();
        $.ajax({
            url: '/comments',
            method: 'GET',
            data: { postId: dataId },
            success: function(response) {
                response.forEach(function(comment) {
                    $('#commentList').append('<li class="border border-secondary p-1 my-1">' + comment.comment + '</li>');
                });
            },
            error: function(xhr, status, error) {
                console.error('Error fetching comments:', error);
            }
        });
    });

    function fetchMoodData(duration) {
        console.log(duration)
        $.ajax({
            url: '/graph',
            method: 'GET',
            data: { duration: duration },
            success: function(response) {
                console.log('Mood data fetched successfully:', response);
                loadChart(response)
            },
            error: function(xhr, status, error) {
                console.error('Error fetching mood data:', error);
            }
        });
    }

    $('#durationSelect').change(function() {
        const selectedDuration = $(this).val();
        fetchMoodData(selectedDuration);
    });

    fetchMoodData('PastWeek');


  });

function loadChart(data) {

    console.log('loaded')

    Highcharts.chart('container', {
        chart: {
            type: 'line'
        },
        title: {
            text: '',
            align: 'left'
        },
        xAxis: {
            categories: [],
            crosshair: true,
            accessibility: {
                description: 'Moods'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Values'
            }
        },
        tooltip: {
            valueSuffix: ' '
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        navigation: {
            buttonOptions: {
                enabled: false
            }
        },

        credits: {
            enabled: false
        },
        series: [
            {
                name: 'Mood',
                data: data
            },
        ]
    });

    this.checkBox();

}


function checkBox() {
    const checkbox = document.getElementById('inlineCheckbox1');
    const publicInput = document.querySelector('input[name="public"]');
    checkbox.addEventListener('change', function () {
        publicInput.value = this.checked.toString();
        console.log(publicInput)
    });
}
