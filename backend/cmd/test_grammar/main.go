package main

import (
"fmt"
"github.com/yuvraj707sharma/vartalaap_V2/backend/internal/rules"
)

func main() {
testCases := []string{
"I has a book",
"Yesterday I go to the market",
"Please do the needful",
"I want to prepone the meeting",
"Could of done better",
"This things are good",
"He have a car",
"They is coming",
"This is correct sentence",
}

fmt.Println("Testing Grammar Rules:")
fmt.Println("======================")

correctCount := 0
errorCount := 0

for _, text := range testCases {
rule, corrected := rules.DetectError(text)
if rule != nil {
errorCount++
fmt.Printf("\n✗ Error Detected: %s\n", text)
fmt.Printf("  Type: %s\n", rule.ErrorType)
fmt.Printf("  Corrected: %s\n", corrected)
fmt.Printf("  Explanation: %s\n", rule.Description)
} else {
correctCount++
fmt.Printf("\n✓ No Error: %s\n", text)
}
}

fmt.Printf("\n\nSummary:\n")
fmt.Printf("========\n")
fmt.Printf("Total test cases: %d\n", len(testCases))
fmt.Printf("Errors detected: %d\n", errorCount)
fmt.Printf("Correct sentences: %d\n", correctCount)
}
