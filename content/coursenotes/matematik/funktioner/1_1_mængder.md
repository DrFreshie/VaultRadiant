---
title: 1.1 Definitions- og værdimængde
---

# 1.1 Definitions- og værdimængde

Mængderne $X$ og $Y$ beskriver de tal som $x$-værdierne hhv. $y$-værdierne tilhører. Mængden $X$, som indeholder de mulige $x$-værdier for funktionen $f$, kaldes også funktionens *definitionsmængde*.

> [!definition] Definitionsmængde
> Givet en funktion $f$, kaldes mængden af tal $x$ for hvilke $f(x)$ eksisterer, *definitionsmængden* for $f$.
>
> Definitionsmængden for $f$ skrives $\text{Dm}(f)$.

Mange af de funktioner man ser på i gymnasiet har alle reelle tal som definitionsmængde; men der er tilfælde hvor nogle tal ikke må anvendes som $x$-værdi.

> [!eksempel]
> Funktionen $f$ har forskriften
> $$
> f(x) = \sqrt{x + 3}
> $$
> Idet man ikke kan tage kvadratroden af et negativt tal, skal $x + 3$ altid være positiv, dvs.
>
> $$
> x + 3 \geq 0 \iff x \geq -3
> $$
>
> Definitionsmængden for $f$ består altså af alle de tal der er større end eller lig med $-3$:
> $$
> \text{Dm}(f) = [-3;\infty[
> $$

> [!eksempel]
> Funktioner $g$ er defineret ved
> $$
> g(x) = \dfrac{3}{4 - x}
> $$
> Idet man ikke må dele med $0$, må nævneren ikke give $0$, dvs.
> $$
> 4 - x \neq 0 \iff x \neq 4
> $$
> Tallet $4$ tilhører derfor ikke $g$'s definitionsmængde, så
> $$
> \text{Dm}(g) = \mathbb{R} \setminus \{4\}
> $$

Mængden af mulige funktionsværdier for en funktion har også en betegnelse. Den kaldes *værdimængden* for en funktion.

> [!definition]  Værdimængde
> Givet en funktion $f$, kaldes mængden af mulige funktionsværdier for $f$ *værdimængden* for $f$. Den betegnes $\text{Vm}(f)$.
>
> Der gælder altså
>
> $$
> \text{Vm}(f) = \{f(x) \mid x \in \text{Dm}(f)\}
> $$
