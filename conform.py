"""
Programming for the Puzzled -- Srini Devadas
You Will All Conform

Input is a list of 'F's and 'B's, in terms of forwards and backwards caps.
Output is a set of commands (printed out) to get either all 'F's or all 'B's.
Fewest commands are the goal.

================================================================================
PART 1: AI VIBE CODING REPORT (Refactoring with Clean Code Practices)
--------------------------------------------------------------------------------
Original Code Issues:
- Manual interval tracking led to code duplication (handling the last interval).
- Tangled logic: finding intervals, counting them, and printing commands were mixed together.
- Inconsistent type hints and somewhat verbose variable initializations.

Antigravity Improvements (Claude 3.7 Sonnet):
1. Utilized `itertools.groupby` to cleanly extract intervals without manual index tracking.
2. Separated logic into distinct steps: grouping caps, determining target, building commands.
3. Added complete Type Hints and clearer, more descriptive variable names.
4. Followed Single Responsibility Principle by extracting the printing logic into a helper function.
================================================================================
"""

from typing import List, Tuple
from itertools import groupby

def please_conform(caps: List[str]) -> None:
    """
    Determines and prints the minimal number of commands needed 
    to make all elements in the array conform to the same direction.
    """
    if not caps:
        return

    # 1. Group consecutive identical caps into intervals
    intervals: List[Tuple[int, int, str]] = []
    current_index: int = 0
    
    for cap_type, group in groupby(caps):
        group_length = sum(1 for _ in group)
        intervals.append((current_index, current_index + group_length - 1, cap_type))
        current_index += group_length

    # 2. Determine which cap direction requires fewer intervals to flip
    forward_count = sum(1 for _, _, cap in intervals if cap == 'F')
    backward_count = sum(1 for _, _, cap in intervals if cap == 'B')
    flip_target = 'F' if forward_count < backward_count else 'B'

    # 3. Print flip commands for the target cap type
    _print_flip_commands(intervals, flip_target)


def _print_flip_commands(intervals: List[Tuple[int, int, str]], flip_target: str) -> None:
    """
    Helper function to print the command string for each interval that needs to be flipped.
    """
    for start_idx, end_idx, cap_type in intervals:
        if cap_type == flip_target:
            if start_idx == end_idx:
                print(f"Person in position {start_idx} flip your cap!")
            else:
                print(f"People in positions {start_idx} through {end_idx} flip your caps!")


if __name__ == "__main__":
    caps_list = ['F', 'F', 'B', 'B', 'B', 'F', 'B', 'B', 'B', 'F', 'F', 'B', 'F']
    caps_list_2 = ['F', 'F', 'B', 'B', 'B', 'F', 'B', 'B', 'B', 'F', 'F', 'F', 'F']
    
    print("Testing first caps list:")
    please_conform(caps_list)
    
    # print("\nTesting second caps list:")
    # please_conform(caps_list_2)
