var jspdf = require('jspdf');
console.log("js loaded");

function downloadPDFWithjsPDF() {
			console.log("BUTTON CLICK");
  			var doc = new jspdf.jsPDF('p', 'pt', 'a4');

  			doc.html(document.querySelector('#styledTable'), {
				callback: function (doc) {
					doc.save('MLB World Series Winners.pdf');
				},
				margin: [60, 60, 60, 60],
				x: 32,
				y: 32,
			});
}

document.querySelector('#jsPDF').addEventListener('click', downloadPDFWithjsPDF);