;	C STARTUP FOR S12Z
;	WITH AUTOMATIC DATA INITIALIZATION
;	Copyright (c) 2008 by COSMIC Software
;
	xdef	_exit, __stext
	xref	_main, __sbss, __idesc__, __memory, __stack
;
__stext:
	ld	x,#__idesc__+1	; descriptor address
	ld	y,(x+)		; start address of flash data
ibcl:
	ld	d0,(x+)		; test flag byte
	beq	zbss		; no more segment
	ld	d7,(4,x)	; segment
	sub	d7,(-5,x)	; size
	lea	d6,(8,x)	; save pointer
	ld	x,(1,x)		; destination pointer
dbcl:
	mov.b	(y+),(x+)	; copy byte
	dbne	d7,dbcl		; count down and loop
	tfr	d6,x		; restore pointer
	bra	ibcl		; and continue
zbss:
	clr	d2		; reset the bss
	ld	x,#__sbss	; start of bss
	ld	y,#__memory	; end of bss
	bra	loop		; start loop
zbcl:
	st	d2,(x+)		; clear word
loop:
	cmp	x,y		; up to the end
	blo	zbcl		; and loop
	ld	s,#__stack	; initialize stack pointer
ifdef PIC
	bsr	_main
else
	jsr	_main		; execute main
endif
_exit:
	bra	_exit		; stay here
;
	end
