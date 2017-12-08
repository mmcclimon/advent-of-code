#!perl
use v5.24;
use warnings;
use Path::Tiny qw(path);

my $pattern = qr{^([a-z]+)   \s   # register
                  (inc|dec)  \s   # instruction
                  (-?[0-9]+) \s   # amount
                  if         \s   # if
                  ([a-z]+)   \s   # other register
                  ([!=<>]+)  \s   # op
                  (-?[0-9]+)      # condition
                }x;

my %registers;
my $max = 0;
my %ops = (
  '==' => sub { $_[0] == $_[1] },
  '!=' => sub { $_[0] != $_[1] },
  '<=' => sub { $_[0] <= $_[1] },
  '>=' => sub { $_[0] >= $_[1] },
  '<'  => sub { $_[0] <  $_[1] },
  '>'  => sub { $_[0] >  $_[1] },
);

for my $line (path('input/day8.txt')->lines) {
  my ($reg, $instr, $amt, $other_reg, $op, $cond) = $line =~ /$pattern/;

  $registers{$reg} //= 0;
  $registers{$other_reg} //= 0;

  $registers{$reg} += $instr eq 'inc' ? $amt : -1 * $amt
    if $ops{$op}->($registers{$other_reg}, $cond);

  $max = $registers{$reg} if $registers{$reg} > $max;
}

my ($biggest) = sort {; $b <=> $a } values %registers;
say "maximum is $biggest";
say "highest ever is $max";
