from __future__ import annotations

import subprocess
import sys
from pathlib import Path


def test_compound_vitest() -> None:
    """Run web/src/lib/compound.test.ts via vitest."""
    root = Path(__file__).resolve().parents[1]
    web_dir = root / "web"
    assert (web_dir / "package.json").is_file(), f"missing {web_dir / 'package.json'}"

    proc = subprocess.run(
        ["npm", "run", "test"],
        cwd=web_dir,
        capture_output=True,
        text=True,
        check=False,
        shell=sys.platform == "win32",
    )
    if proc.returncode != 0:
        msg = proc.stderr.strip() or proc.stdout.strip() or "vitest failed"
        raise AssertionError(msg)
