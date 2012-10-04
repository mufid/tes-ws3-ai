// ===================== Helper =======================
var _ = require("./underscore.js");
function l(apa) { console.log(apa); }

// ===================== Helper =======================
function kromosom() {
	var acak = [0, 0, 0, 0, 0, 0, 0,
				1, 1, 1, 1, 1, 1, 1];
	acak = _.shuffle(acak);
	this.string = _.first(acak, 7);
}

kromosom.prototype.harga = [300, 150, 100, 80, 100, 150, 200];
kromosom.prototype.berat = [  9,   5,   9,  4,   3,   1,   7];
kromosom.prototype.beratMax = 20;
kromosom.prototype.fitness = function() {
	// Hitung string
	var t = this;
	var i = 0, temp;
	var hargaMax = _.reduce(this.harga, function(prev, now) {
		return prev + now;
	});

	var fitness = 0;

	_.each(this.string, function(apa, idx) {
		if (apa == 1) fitness += t.harga[idx];
	});
	return fitness / hargaMax;
}
kromosom.prototype.beratnya = function() {
	var beratTotal = 0;
	var t = this;
	_.each(this.string, function(apa, idx) {
		if (apa == 1) beratTotal += t.berat[idx];
	});
	return beratTotal;
};
kromosom.prototype.valid = function() {
	if (this.beratnya() > 20) return false; else return true;
}

function selektor(apa, n) {
	// Pilih kromosom
	var hasil = [];
	var jumlah_fitness = _.reduce(apa, function(n, m) { return n+m; });
	_.each(apa, function(individu) {
		individu.prob = individu.fitness() / jumlah_fitness;
	});
	while (hasil.length <= n) {
		var acakan = _.reduce().
		if (_.contains(hasil, acakan) == false) _.push(acakan);
	}
	return hasil;
}

// =================== MAIN CODE =======================

// Mendapatkan enam kromosom
l("Populasi Awal");
var populasi_awal = [];
_.range(9999).forEach(function(apa, idx) {
	var kr = new kromosom();
	if (populasi_awal.length <= 6 && kr.valid()) populasi_awal.push(kr);
});
_.each(populasi_awal, function(apa) { l(apa.string + " : " + apa.fitness()); });

l("Seleksi 4");

selektor(populasi_awal);