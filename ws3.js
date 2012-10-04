// ===================== Helper =======================
var _ = require("./underscore.js");
function l(apa) { console.log(apa); }
function panik() { l("Paniiikkk!"); }

// ===================== Helper =======================

function kromoprint(apa) {
	_.each(apa, function(kr) {
		l(kr.string + " f: " + kr.fitness() + " w: " + kr.beratnya());
	});
}

function kromosom(string) {
	if (string) {
		var t = this;
		this.string = [];
		_.each(string, function(s) {
			t.string.push(s);
		});
	} else {
	var acak = [0, 0, 0, 0, 0, 0, 0,
				1, 1, 1, 1, 1, 1, 1];
	acak = _.shuffle(acak);
	var t = this;
	this.string = _.first(acak, 7);
	}
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
	if (this.beratnya() > 20 && this.beratnya() > 0) return false; else return true;
}

function selektor(apa, n) {
	// Pilih kromosom
	var hasil = [];
	var jumlah_fitness = _.reduce(apa, function(prev, now) {
			return prev + now.fitness(); 
		}, 0);
	_.each(apa, function(individu) {
		individu.prob = individu.fitness() / jumlah_fitness;
	});
	_.reduce(apa, function(prev, now) {
		console.log(now, "di", prev, "sampai", now.prob + prev);
		return prev + now.prob;
	}, 0);
	while (hasil.length < n) {
		var acakan = false;
		var rand   = Math.random();
		
		_.reduce(apa, function(prev, now) {
			if (acakan === false && now.prob + prev > rand) {
				acakan = now;
			} else {
				return now.prob + prev;
			}
		}, 0);
		// Jangan sampai ada duplikat.
		l("Random.. got " + rand + " that is " + acakan.string);
		if (_.contains(hasil, acakan) == false) 
			hasil.push(acakan);
	}
	return hasil;
}

function crossover(apa) {
	// Crossover dilakukan di
	// apa <= 1 : do nothing
	if (apa.length <= 1) panik();

	// Nah sekarang duplicate dulu
	var queue = _.first(apa, apa.length);
	var asli  = _.first(apa, apa.length);

	// Setelah di-duplicate, ambil dua
	var tukar = function(a, b) {
		// ambil 3 pertama, tukar
		var a1 = _.first(a.string, 3),
		    a2 = _.last (a.string, 4),
		    b1 = _.first(b.string, 3),
		    b2 = _.last (b.string, 4),
		    af = [], bf = [];

		af.push(a1); af.push(b2);
		bf.push(b1); bf.push(a2);

		var hasil = [];
		hasil.push(new kromosom(_.flatten(af)));
		hasil.push(new kromosom(_.flatten(bf)));
		return hasil;
	}

	var hasil = [];
	while (queue.length > 1) {
		var ambil1 = _.first(queue);
		queue = _.rest(queue);
		var ambil2 = _.first(queue);
		queue = _.rest(queue);
		hasil = _.union(hasil, tukar(ambil1, ambil2));
	}
	// Belum habis?
	if (queue.length > 0) {
		hasil = _.union(hasil, tukar(
									  _.first(queue), 
									  _.first(_.shuffle(asli))
									));
	}
	// Crossover selesai!
	return hasil;
}

// =================== MAIN CODE =======================

// Mendapatkan enam kromosom
l("Populasi Awal");
var populasi_awal = [];
var seleksi0;
var crossover0;
_.range(9999).forEach(function(apa, idx) {
	var kr = new kromosom();
	if (populasi_awal.length <= 6 && kr.valid()) populasi_awal.push(kr);
});
_.each(populasi_awal, function(apa) { l(apa.string + " f: " + apa.fitness() + " w: " + apa.beratnya()); });
l("Seleksi 4 ===> ");
seleksi0 = selektor(populasi_awal, 4);
l("Seleksi ==>");
console.log("Dapat", seleksi0);
l("Hasil crossover seleksi ==> ");
crossover0 = crossover(seleksi0);
l(crossover0);

var generasi1 = _.union(_.difference(populasi_awal, seleksi0), crossover0);
l("GENERASI 1 ==>");
kromoprint(generasi1);

// Buang semua yang gak valid!
generasi1 = _.filter(generasi1, function(ini) {
	if (ini.valid()) return true;
	else return false;
});

l("GENERASI 1 (setelah yang tidak valid dibuang) ==>");
kromoprint(generasi1);

// Nah sekarang seleksi untuk crossover untuk generasi 2
var seleksi1 = selektor(generasi1, 4);
console.log("Dapat", seleksi1);
l("Crossover ==>");
var crossover1 = crossover(seleksi1);
kromoprint(crossover1);

// Satukan yang tidak terkena seleksi dan jadikan
// mereka bagian dari generasi baru
var generasi2 = _.union(_.difference(generasi1, seleksi1), crossover1);
l("GENERASI 2 ===>");
kromoprint(generasi2);
generasi2 = _.filter(generasi2, function(ini) {
	if (ini.valid()) return true;
	else return false;
});
l("GENERASI 2 (REFINED)");
kromoprint(generasi2);