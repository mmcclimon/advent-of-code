#include <stdio.h>
#define STEP_SIZE 367

int main() {
    int ptr = 0;
    int first_elem = 0;
    int buf_len = 1;

    for (int i = 0; i <= 50000000; i++) {
        ptr = (ptr + STEP_SIZE) % buf_len++;
        if (++ptr == 1)
            first_elem = i;
    }

    printf("element after 0 is %d\n", first_elem);

    return 0;
}
