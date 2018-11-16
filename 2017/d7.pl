#!perl
use warnings;
use v5.24;
use Path::Tiny qw(path);
use Data::Dumper::Concise;

chomp (my @i= path("input/d7.txt")->lines);

my $T = 0;
for (@i) {
  my ($b,$w);
  /(.)(?!\1)(.)\2\1/?++$w&&/^\[/?$b++:0:0 for split /(\[.*?\])/;
  $T++ if $w&&!$b;
}

say "$T support TLS";


my $t = 0;
A: for (@i) {
  my %s = map {; $_ => [] } qw(b n);

  for (split /(\[.*?\])/) {
    my $ib=/^\[/;
    my @l=/./g;
    for (my $i=0; $i<@l-2; $i++) {
      next if join $",@l[$i..$i+2] =~ /^\[|\]$/;
      push $s{$ib?'b':'n'}->@*, join '',@l[$i..$i+2]
        if $l[$i] eq $l[$i+2] && $l[$i] ne $l[$i+1];
    }
  }

  for my $b ($s{b}->@*) {
    for ($s{n}->@*) { $t++ and next A if $b eq (join '', (/./g)[1,0,1]) }
  }
}

say "$t support SSL";
