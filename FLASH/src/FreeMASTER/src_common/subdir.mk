################################################################################
# Automatically-generated file. Do not edit!
################################################################################

-include ../../../makefile.local

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS_QUOTED += \
"../src/FreeMASTER/src_common/freemaster_appcmd.c" \
"../src/FreeMASTER/src_common/freemaster_bdm.c" \
"../src/FreeMASTER/src_common/freemaster_can.c" \
"../src/FreeMASTER/src_common/freemaster_protocol.c" \
"../src/FreeMASTER/src_common/freemaster_rec.c" \
"../src/FreeMASTER/src_common/freemaster_scope.c" \
"../src/FreeMASTER/src_common/freemaster_serial.c" \
"../src/FreeMASTER/src_common/freemaster_sfio.c" \
"../src/FreeMASTER/src_common/freemaster_tsa.c" \

C_SRCS += \
../src/FreeMASTER/src_common/freemaster_appcmd.c \
../src/FreeMASTER/src_common/freemaster_bdm.c \
../src/FreeMASTER/src_common/freemaster_can.c \
../src/FreeMASTER/src_common/freemaster_protocol.c \
../src/FreeMASTER/src_common/freemaster_rec.c \
../src/FreeMASTER/src_common/freemaster_scope.c \
../src/FreeMASTER/src_common/freemaster_serial.c \
../src/FreeMASTER/src_common/freemaster_sfio.c \
../src/FreeMASTER/src_common/freemaster_tsa.c \

OBJS += \
./src/FreeMASTER/src_common/freemaster_appcmd_c.obj \
./src/FreeMASTER/src_common/freemaster_bdm_c.obj \
./src/FreeMASTER/src_common/freemaster_can_c.obj \
./src/FreeMASTER/src_common/freemaster_protocol_c.obj \
./src/FreeMASTER/src_common/freemaster_rec_c.obj \
./src/FreeMASTER/src_common/freemaster_scope_c.obj \
./src/FreeMASTER/src_common/freemaster_serial_c.obj \
./src/FreeMASTER/src_common/freemaster_sfio_c.obj \
./src/FreeMASTER/src_common/freemaster_tsa_c.obj \

OBJS_QUOTED += \
"./src/FreeMASTER/src_common/freemaster_appcmd_c.obj" \
"./src/FreeMASTER/src_common/freemaster_bdm_c.obj" \
"./src/FreeMASTER/src_common/freemaster_can_c.obj" \
"./src/FreeMASTER/src_common/freemaster_protocol_c.obj" \
"./src/FreeMASTER/src_common/freemaster_rec_c.obj" \
"./src/FreeMASTER/src_common/freemaster_scope_c.obj" \
"./src/FreeMASTER/src_common/freemaster_serial_c.obj" \
"./src/FreeMASTER/src_common/freemaster_sfio_c.obj" \
"./src/FreeMASTER/src_common/freemaster_tsa_c.obj" \

C_DEPS += \
./src/FreeMASTER/src_common/freemaster_appcmd_c.d \
./src/FreeMASTER/src_common/freemaster_bdm_c.d \
./src/FreeMASTER/src_common/freemaster_can_c.d \
./src/FreeMASTER/src_common/freemaster_protocol_c.d \
./src/FreeMASTER/src_common/freemaster_rec_c.d \
./src/FreeMASTER/src_common/freemaster_scope_c.d \
./src/FreeMASTER/src_common/freemaster_serial_c.d \
./src/FreeMASTER/src_common/freemaster_sfio_c.d \
./src/FreeMASTER/src_common/freemaster_tsa_c.d \

C_DEPS_QUOTED += \
"./src/FreeMASTER/src_common/freemaster_appcmd_c.d" \
"./src/FreeMASTER/src_common/freemaster_bdm_c.d" \
"./src/FreeMASTER/src_common/freemaster_can_c.d" \
"./src/FreeMASTER/src_common/freemaster_protocol_c.d" \
"./src/FreeMASTER/src_common/freemaster_rec_c.d" \
"./src/FreeMASTER/src_common/freemaster_scope_c.d" \
"./src/FreeMASTER/src_common/freemaster_serial_c.d" \
"./src/FreeMASTER/src_common/freemaster_sfio_c.d" \
"./src/FreeMASTER/src_common/freemaster_tsa_c.d" \

OBJS_OS_FORMAT += \
./src/FreeMASTER/src_common/freemaster_appcmd_c.obj \
./src/FreeMASTER/src_common/freemaster_bdm_c.obj \
./src/FreeMASTER/src_common/freemaster_can_c.obj \
./src/FreeMASTER/src_common/freemaster_protocol_c.obj \
./src/FreeMASTER/src_common/freemaster_rec_c.obj \
./src/FreeMASTER/src_common/freemaster_scope_c.obj \
./src/FreeMASTER/src_common/freemaster_serial_c.obj \
./src/FreeMASTER/src_common/freemaster_sfio_c.obj \
./src/FreeMASTER/src_common/freemaster_tsa_c.obj \


# Each subdirectory must supply rules for building sources it contributes
src/FreeMASTER/src_common/freemaster_appcmd_c.obj: ../src/FreeMASTER/src_common/freemaster_appcmd.c
	@echo 'Building file: $<'
	@echo 'Executing target #15 $<'
	@echo 'Invoking: S12Z Compiler'
	"$(S12Z_ToolsDirEnv)/mwccs12lisa" -c @@"src/FreeMASTER/src_common/freemaster_appcmd.args" -o "src/FreeMASTER/src_common/freemaster_appcmd_c.obj" "$<" -MD -gccdep
	@echo 'Finished building: $<'
	@echo ' '

src/FreeMASTER/src_common/%.d: ../src/FreeMASTER/src_common/%.c
	@echo 'Regenerating dependency file: $@'
	
	@echo ' '

src/FreeMASTER/src_common/freemaster_bdm_c.obj: ../src/FreeMASTER/src_common/freemaster_bdm.c
	@echo 'Building file: $<'
	@echo 'Executing target #16 $<'
	@echo 'Invoking: S12Z Compiler'
	"$(S12Z_ToolsDirEnv)/mwccs12lisa" -c @@"src/FreeMASTER/src_common/freemaster_bdm.args" -o "src/FreeMASTER/src_common/freemaster_bdm_c.obj" "$<" -MD -gccdep
	@echo 'Finished building: $<'
	@echo ' '

src/FreeMASTER/src_common/freemaster_can_c.obj: ../src/FreeMASTER/src_common/freemaster_can.c
	@echo 'Building file: $<'
	@echo 'Executing target #17 $<'
	@echo 'Invoking: S12Z Compiler'
	"$(S12Z_ToolsDirEnv)/mwccs12lisa" -c @@"src/FreeMASTER/src_common/freemaster_can.args" -o "src/FreeMASTER/src_common/freemaster_can_c.obj" "$<" -MD -gccdep
	@echo 'Finished building: $<'
	@echo ' '

src/FreeMASTER/src_common/freemaster_protocol_c.obj: ../src/FreeMASTER/src_common/freemaster_protocol.c
	@echo 'Building file: $<'
	@echo 'Executing target #18 $<'
	@echo 'Invoking: S12Z Compiler'
	"$(S12Z_ToolsDirEnv)/mwccs12lisa" -c @@"src/FreeMASTER/src_common/freemaster_protocol.args" -o "src/FreeMASTER/src_common/freemaster_protocol_c.obj" "$<" -MD -gccdep
	@echo 'Finished building: $<'
	@echo ' '

src/FreeMASTER/src_common/freemaster_rec_c.obj: ../src/FreeMASTER/src_common/freemaster_rec.c
	@echo 'Building file: $<'
	@echo 'Executing target #19 $<'
	@echo 'Invoking: S12Z Compiler'
	"$(S12Z_ToolsDirEnv)/mwccs12lisa" -c @@"src/FreeMASTER/src_common/freemaster_rec.args" -o "src/FreeMASTER/src_common/freemaster_rec_c.obj" "$<" -MD -gccdep
	@echo 'Finished building: $<'
	@echo ' '

src/FreeMASTER/src_common/freemaster_scope_c.obj: ../src/FreeMASTER/src_common/freemaster_scope.c
	@echo 'Building file: $<'
	@echo 'Executing target #20 $<'
	@echo 'Invoking: S12Z Compiler'
	"$(S12Z_ToolsDirEnv)/mwccs12lisa" -c @@"src/FreeMASTER/src_common/freemaster_scope.args" -o "src/FreeMASTER/src_common/freemaster_scope_c.obj" "$<" -MD -gccdep
	@echo 'Finished building: $<'
	@echo ' '

src/FreeMASTER/src_common/freemaster_serial_c.obj: ../src/FreeMASTER/src_common/freemaster_serial.c
	@echo 'Building file: $<'
	@echo 'Executing target #21 $<'
	@echo 'Invoking: S12Z Compiler'
	"$(S12Z_ToolsDirEnv)/mwccs12lisa" -c @@"src/FreeMASTER/src_common/freemaster_serial.args" -o "src/FreeMASTER/src_common/freemaster_serial_c.obj" "$<" -MD -gccdep
	@echo 'Finished building: $<'
	@echo ' '

src/FreeMASTER/src_common/freemaster_sfio_c.obj: ../src/FreeMASTER/src_common/freemaster_sfio.c
	@echo 'Building file: $<'
	@echo 'Executing target #22 $<'
	@echo 'Invoking: S12Z Compiler'
	"$(S12Z_ToolsDirEnv)/mwccs12lisa" -c @@"src/FreeMASTER/src_common/freemaster_sfio.args" -o "src/FreeMASTER/src_common/freemaster_sfio_c.obj" "$<" -MD -gccdep
	@echo 'Finished building: $<'
	@echo ' '

src/FreeMASTER/src_common/freemaster_tsa_c.obj: ../src/FreeMASTER/src_common/freemaster_tsa.c
	@echo 'Building file: $<'
	@echo 'Executing target #23 $<'
	@echo 'Invoking: S12Z Compiler'
	"$(S12Z_ToolsDirEnv)/mwccs12lisa" -c @@"src/FreeMASTER/src_common/freemaster_tsa.args" -o "src/FreeMASTER/src_common/freemaster_tsa_c.obj" "$<" -MD -gccdep
	@echo 'Finished building: $<'
	@echo ' '


