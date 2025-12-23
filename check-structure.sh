#!/bin/bash

echo "=== Checking Components Structure ==="
for comp in Header DashboardLayout Login Register ProtectedRoute; do
    echo ""
    echo "--- $comp ---"
    if [ -d "src/components/$comp" ]; then
        ls -la "src/components/$comp/"
        if [ -d "src/components/$comp/css" ]; then
            echo "  css folder:"
            ls -la "src/components/$comp/css/"
        fi
    else
        echo "  ERROR: Directory not found!"
    fi
done

echo ""
echo "=== Checking Pages Structure ==="
for page in AuthPage Profile Notes News Participants; do
    echo ""
    echo "--- $page ---"
    if [ -d "src/pages/$page" ]; then
        ls -la "src/pages/$page/"
        if [ -d "src/pages/$page/css" ]; then
            echo "  css folder:"
            ls -la "src/pages/$page/css/"
        fi
    else
        echo "  ERROR: Directory not found!"
    fi
done

echo ""
echo "=== Structure Check Complete ==="

