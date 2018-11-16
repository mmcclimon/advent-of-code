#!perl
use v5.24;
use warnings;
use Path::Tiny qw(path);

my $valid = 0;

LINE: for my $line (path('input/day4.txt')->lines) {
  my %ok;
  for my $w (split /\s+/, $line) {
    my $k = join '', sort split //, $w;
    next LINE if $ok{$k};
    $ok{$k}++;
  }
  $valid++;
}

say "total valid: $valid";
