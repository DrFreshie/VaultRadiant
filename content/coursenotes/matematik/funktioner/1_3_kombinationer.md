---
title: 1.3 Kombinationer af funktioner
---

# 1.3 Kombinationer af funktioner

Man kan regne med funktioner ligesom man kan regne med tal. Ganger man en funktion $f$ med en konstant $c$, får man en ny funktion $c \cdot f$ defineret ved $(c \cdot f)(x) = c \cdot f(x)$.

To funktioner kan også lægges sammen eller trækkes fra hinanden. Man har følgende definition:

> [!definition] Regneregler for funktioner
> Lad der være givet to funktioner $f$ og $g$ samt en konstant $c$. Funktionerne $c \cdot f$, $f + g$, $f - g$, $f \cdot g$ og $\frac{f}{g}$ er defineret ved:
>
> $$
> \begin{aligned}
> (c \cdot f)(x) &= c \cdot f(x) \\
> (f + g)(x) &= f(x) + g(x) \\
> (f - g)(x) &= f(x) - g(x) \\
> (f \cdot g)(x) &= f(x) \cdot g(x) \\
> \left(\tfrac{f}{g}\right)(x) &= \frac{f(x)}{g(x)}
> \end{aligned}
> $$

Man regner altså på funktioner ved at regne på deres funktionsværdier. F.eks. er funktionsværdierne for funktionen $c\cdot f$ funktionsværdierne for $f$ ganget med $c$. Der må så gælde, at
$$
\text{Dm}(c \cdot f) = \text{Dm}(f)
$$
idet $c\cdot f$ og $f$ må være defineret for præcis de samme værdier af $x$.

<span class="fig-trigger" data-iframe="https://www.geogebra.org/material/iframe/id/tdxpaeme"></span>
> [!eksempel]
> Figuren viser graferne for funktionerne $f$ og $3\cdot f$ hvor $f$ er givet ved 
> $$
> f(x)=\frac{2}{x^2+1}.
> $$
> Forskriften for $3\cdot f$ er så 
> $$
> (3\cdot f)(x)=3\cdot f(x)=\frac{6}{x^2+1}.
> $$
> Figuren viser at grafen for $f$ går gennem punktet $(1,1)$, mens grafen for $3\cdot f$ går gennem punktet $(3,1)$. Alle funktionsværdierne bliver således 3 gange så store, og grafen for $3\cdot f$ er en skalering af grafen for $f$.
> 
> Analyserer man funktionsudtrykket for $f$, finder man at 
> $$
> \text{Vm}(f)=]0;2].
> $$
> Idet alle funktionsværdierne for $3\cdot f$ er 3 gange de tilsvarende funktionsværider for $f$, giver det at 
> $$
> \text{Vm}(3\cdot f)=]0;6],
> $$
> hvilket også ses på figuren.
<span class="fig-trigger" data-fig=""></span>

Definitionsmængden for kombinationer af to funktioner er de $x$-værdier hvor begge funktioner er defineret:

$$
\text{Dm}(f + g) = \text{Dm}(f - g) = \text{Dm}(f \cdot g) = \text{Dm}(f) \cap \text{Dm}(g)
$$

Undtagelsen er $\frac{f}{g}$, som ikke må indeholde de $x$-værdier hvor $g(x) = 0$:

$$
\text{Dm}\!\left(\tfrac{f}{g}\right) = \text{Dm}(f) \cap \{x \in \text{Dm}(g) \mid g(x) \neq 0\}
$$

> [!eksempel]
> Funktionerne $f$ og $g$ er givet ved $f(x) = x^2 - 5$ og $g(x) = 2^x$. Da er:
>
> $$
> \begin{aligned}
> f(3) &= 3^2 - 5 = 4 \\
> g(3) &= 2^3 = 8
> \end{aligned}
> $$
>
> Så $(f \cdot g)(3) = f(3) \cdot g(3) = 4 \cdot 8 = 32$.

> [!eksempel]
> Lad $f(x) = \dfrac{2}{x^2 + 1}$. Forskriften for $3 \cdot f$ er
>
> $$
> (3 \cdot f)(x) = 3 \cdot f(x) = \frac{6}{x^2 + 1}
> $$
>
> Grafen for $f$ går gennem $(1, 1)$, mens grafen for $3 \cdot f$ går gennem $(1, 3)$ — alle funktionsværdier skaleres med faktoren $3$. Det gælder at $\text{Vm}(f) = {]}0; 2{]}$ og $\text{Vm}(3 \cdot f) = {]}0; 6{]}$.


*Figur 1.3: Graferne for $f$ og $3 \cdot f$.*


> [!eksempel]
> To funktioner $f$ og $g$ er givet ved $f(x) = \frac{1}{2}x$ og $g(x) = \sqrt{x + 4}$. Funktionen $f + g$ har forskriften
>
> $$
> (f + g)(x) = \tfrac{1}{2}x + \sqrt{x + 4}
> $$
>
> Definitionsmængderne er $\text{Dm}(f) = \mathbb{R}$ og $\text{Dm}(g) = [-4; \infty[$, så
>
> $$
> \text{Dm}(f + g) = [-4; \infty[
> $$
>
> Værdimængderne aflæses fra grafen:
>
> $$
> \text{Vm}(f) = \mathbb{R}, \quad \text{Vm}(g) = [0; \infty[, \quad \text{Vm}(f + g) = [-2; \infty[
> $$

<span class="fig-trigger" data-fig="figur_1_4.png"></span>
> [!eksempel]
> To funktioner $f$ og $g$ er givet ved $f(x) = 2x$ og $g(x) = x^2 + 1$. Funktionen $\frac{f}{g}$ har forskriften
>
> $$
> \left(\tfrac{f}{g}\right)(x) = \frac{2x}{x^2 + 1}
> $$
>
> Da $g(x) = x^2 + 1 \geq 1 > 0$ for alle $x$, er $\text{Dm}\!\left(\frac{f}{g}\right) = \mathbb{R}$. Værdimængderne er:
>
> $$
> \text{Vm}(f) = \mathbb{R}, \quad \text{Vm}(g) = [1; \infty[, \quad \text{Vm}\!\left(\tfrac{f}{g}\right) = [-1; 1]
> $$
<span class="fig-trigger" data-fig=""></span>

En anden måde at kombinere funktioner er ved *sammensætning*. Man finder funktionsværdien af $f \circ g$ ved først at beregne $g(x)$ og derefter anvende $f$ på resultatet.

> [!definition] Sammensat funktion
> Givet to funktioner $f$ og $g$, defineres den *sammensatte funktion* $f \circ g$ som den funktion hvor
>
> $$
> (f \circ g)(x) = f(g(x))
> $$

<span class="fig-trigger" data-fig="figur_1_5.png"></span>
> [!eksempel]
> Lad $f(x) = \sqrt{x + 5}$ og $g(x) = x^2 + 7$. Da er
>
> $$
> \begin{aligned}
> g(2) &= 2^2 + 7 = 11 \\
> f(11) &= \sqrt{11 + 5} = 4
> \end{aligned}
> $$
>
> Så $(f \circ g)(2) = f(g(2)) = f(11) = 4$.
>
> En forskrift for $f \circ g$ fås ved at erstatte $x$ i $f$ med udtrykket for $g$:
>
> $$
> (f \circ g)(x) = \sqrt{g(x) + 5} = \sqrt{(x^2 + 7) + 5} = \sqrt{x^2 + 12}
> $$


<iframe src="https://www.geogebra.org/material/iframe/id/rnnvxd4k" width="100%" height="400" style="border:none; border-radius:6px;" allowfullscreen></iframe>

*Figur 1.6: Graferne for $f$, $g$ og $f \circ g$.*
