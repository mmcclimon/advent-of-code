#include <stdio.h>
#define ARR_SIZE 1200

int main() {
    FILE *fp = fopen("input/day5.txt", "r");
    int instr[ARR_SIZE];

    int i = 0;
    int num;

    while(fscanf(fp, "%d", &num) > 0)
        instr[i++] = num;

    int len = i;
    i = 0;
    int jumps = 0;

    while (i >= 0 && i < len) {
        int this_jump = instr[i];
        instr[i] += this_jump < 3 ? 1 : -1;
        i += this_jump;
        jumps++;
    }

    printf("total jumps: %d\n", jumps);

    return 0;
}
